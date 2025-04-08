import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import Layout from "../components/Layout";

const banks = [
  { label: "Vietcombank (VCB)", value: "VCB" },
  { label: "BIDV (BID)", value: "BID" },
  { label: "VietinBank (CTG)", value: "CTG" },
  { label: "Techcombank (TCB)", value: "TCB" },
  { label: "VPBank (VPB)", value: "VPB" },
  { label: "MB (MBB)", value: "MBB" },
  { label: "ACB (ACB)", value: "ACB" },
  { label: "HDBank (HDB)", value: "HDB" },
  { label: "LPBank (LPB)", value: "LPB" },
  { label: "Sacombank (STB)", value: "STB" },
];

const Withdraw = () => {
  const { data: session } = useSession();
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Session:', session);
  }, [session]);

  const handleWithdraw = async () => {
    if (isLoading) return; // Ngăn chặn nhiều yêu cầu cùng lúc
    
    console.log("Rút tiền được nhấn");
    setIsLoading(true);
    
    try {
      // Kiểm tra session và token
      if (!session) {
        console.error('Chưa đăng nhập');
        setIsLoading(false);
        return;
      }

      // Lấy token từ session
      const token = session?.user?.accessToken;
      if (!token) {
        console.error('Không tìm thấy token xác thực');
        setIsLoading(false);
        return;
      }

      console.log('Token:', token);

      const response = await fetch('http://localhost:8082/api/v1/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount, 
          bank, 
          accountNumber,
          username: session.user.taiKhoan
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định' }));
        
        if (response.status === 429) {
          // Nếu bị giới hạn yêu cầu, đợi 5 giây rồi thử lại
          await new Promise(resolve => setTimeout(resolve, 5000));
          setIsLoading(false);
          return handleWithdraw();
        }
        
        if (response.status === 401) {
          // Thử làm mới token
          try {
            const refreshResponse = await fetch('/api/auth/session', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (refreshResponse.ok) {
              // Token đã được làm mới, thử lại yêu cầu rút tiền
              setIsLoading(false);
              return handleWithdraw();
            }
          } catch (refreshError) {
            console.error('Lỗi khi làm mới token:', refreshError);
          }
          
          // Nếu không thể làm mới token, đăng xuất
          signOut({ callbackUrl: '/login' });
          return;
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        window.location.href = '/withdraw-history';
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Rút tiền
        </Typography>
        <TextField
          label="Số tiền"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
          disabled={isLoading}
          sx={{ 
            input: { color: 'black' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'gray',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <TextField
          select
          label="Ngân hàng"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          fullWidth
          margin="normal"
          disabled={isLoading}
          sx={{ 
            '& .MuiSelect-select': {
              color: 'black',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'gray',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        >
          {banks.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Số tài khoản"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          fullWidth
          margin="normal"
          disabled={isLoading}
          sx={{ 
            input: { color: 'black' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'gray',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleWithdraw}
          disabled={isLoading}
          sx={{ 
            marginTop: "1rem", 
            color: "#fff", 
            backgroundColor: "#f44336",
            '&:hover': {
              backgroundColor: "#d32f2f",
            },
            '&.Mui-disabled': {
              backgroundColor: "#ffcdd2",
              color: "#fff"
            }
          }}
        >
          {isLoading ? 'Đang xử lý...' : 'Rút tiền'}
        </Button>
      </Box>
    </Layout>
  );
};

export default Withdraw; 