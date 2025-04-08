import api from "@/configs/axios";
import AuthService from "@/services/AuthService";
import ms from "ms";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(tokenObject) {
  try {
    console.log('Refreshing token...');
    const tokenResponse = await api.post(
      `/v1/nguoidung/refresh-token`,
      {
        refreshToken: tokenObject.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenObject.accessToken}`,
        },
      }
    );

    console.log('Token refreshed successfully');
    return {
      ...tokenObject,
      accessToken: tokenResponse.data.data.accessToken,
      refreshToken: tokenResponse.data.data.refreshToken,
      expireAccessToken: tokenResponse.data.data.expireAccessToken,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      id: "login",
      name: "login",
      async authorize(credentials, req) {
        try {
          const { taiKhoan, matKhau } = credentials;
          const loginAccount = await AuthService.signIn({
            taiKhoan,
            matKhau,
          });

          return loginAccount.data.data;
        } catch (err) {
          if (err && err.response) {
            throw new Error(err.response.data.message);
          }
          throw err;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = user?.data?.status ?? false;
      if (!isAllowedToSignIn) {
        throw new Error("Tài khoản không có quyền truy cập");
      }
      return isAllowedToSignIn;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      try {
        if (user) {
          const { data, accessToken, refreshToken, expireAccessToken } = user;
          token.taiKhoan = data.taiKhoan;
          token.role = data.role;
          token.id = data._id;
          token.accessToken = accessToken;
          token.expireAccessToken = expireAccessToken;
          token.refreshToken = refreshToken;
        }

        const remainTimeAccessToken = Math.floor((token.expireAccessToken - Date.now()) / 1000);
        const fivePercentRemainTimeAccessToken = Math.floor(
          ((ms(process.env.JWT_ACCESSTOKEN_EXPIRED) / 1000) * 50) / 100
        );
        const isShouldRefreshTime = remainTimeAccessToken <= fivePercentRemainTimeAccessToken;

        if (isShouldRefreshTime) {
          console.log('Token is about to expire, refreshing...');
          return await refreshAccessToken(token);
        }

        return token;
      } catch (err) {
        console.error('Error in jwt callback:', err);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          taiKhoan: token.taiKhoan,
          role: token.role,
          id: token.id,
          accessToken: token.accessToken,
        };
      }
      return session;
    },
  },
});
