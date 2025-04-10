import { Box, Card, Typography } from "@mui/material";

import Image from "next/image";
import Link from "next/link";
import BreadcrumbBar from "../BreadcrumbBar";
const listGame = [
  {
    title: "QUẢN LÝ NGÂN HÀNG",
    link: "/admin/settings/bank",
    icon: "https://i.imgur.com/HeeXUhh.png",
    introduce: "Chỉnh sửa danh sách ngân hàng để user nạp tiền",
  },
  {
    title: "THÔNG BÁO",
    link: "/admin/settings/notifications",
    icon: "https://i.imgur.com/nmkGJFj.png",
    introduce: "Chỉnh sửa thông báo hệ thống",
  },
  {
    title: "QUẢN LÝ USER",
    link: "/admin/users",
    icon: "https://i.imgur.com/iSdVffh.png",
    introduce: "Quản lý người dùng",
  },
  {
    title: "QUẢN LÝ GAME",
    link: "/admin/games",
    icon: "https://i.imgur.com/Z8wX9uM.png",
    introduce: "Quản lý các game",
  },
  {
    title: "CẤU HÌNH TELEGRAM",
    link: "/admin/settings/telegram",
    icon: "https://i.imgur.com/qF3giFS.png",
    introduce: "Cấu hình telegram bao gồm BOT gửi message khi có có yêu cầu rút, nạp, đặt cược; CSKH",
  },
  {
    title: "CẤU HÌNH CSKH TAWK.TO",
    link: "/admin/settings/tawk-to",
    icon: "https://i.imgur.com/K5Lnk4O.png",
    introduce: "Cấu hình CSKH Live chat TawkTo",
  },
  {
    title: "QUẢN LÝ RÚT TIỀN",
    link: "/admin/settings/withdraw-management",
    icon: "https://i.imgur.com/HeeXUhh.png",
    introduce: "Quản lý lịch sử rút tiền và cập nhật trạng thái",
  },
];

const BreadcrumbData = [
  {
    title: "Admin",
    href: "/admin",
  },
  {
    title: "Quản lý",
    href: "/admin/settings",
  },
];

const Overview = () => {
  return (
    <>
      <BreadcrumbBar data={BreadcrumbData} />
      <h1
        className="title"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Quản lý hệ thống
      </h1>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0,1fr))",

            sm: "repeat(3, minmax(0,1fr))",

            lg: "repeat(4, minmax(0,1fr))",
            xl: "repeat(5, minmax(0,1fr))",
          },
          gap: "2rem",
        }}
      >
        {listGame.map((item, i) => (
          <Link href={item.link} key={i}>
            <Card
              sx={{
                cursor: "pointer",
                backgroundColor: "#ffffff",
                color: "#201c58",
                minHeight: "15rem",

                display: "flex",

                padding: "1.5rem",

                maxWidth: "20rem",
                boxShadow: "-1px 2px 14px 5px #edf0f8",
                borderRadius: "3rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",

                  width: "100%",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: "4rem",
                    height: "4rem",
                    position: "relative",
                  }}
                >
                  <Image src={item.icon} layout="fill" />
                </Box>

                <Typography
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "1.5rem",
                  }}
                >
                  {item.introduce}
                </Typography>
              </Box>
            </Card>
          </Link>
        ))}
      </Box>
    </>
  );
};
export default Overview;
