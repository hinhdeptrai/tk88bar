import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from "@mui/material";
import Layout from "../components/Layout";

const WithdrawHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (isLoading) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:8082/api/v1/withdraw/history');
        if (!response.ok) {
          throw new Error('Lỗi khi tải lịch sử');
        }
        const data = await response.json();
        setHistory(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Layout>
      <Box sx={{ 
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: "#333",
            fontWeight: "bold",
            marginBottom: "1.5rem"
          }}
        >
          Lịch sử rút tiền
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ padding: '1rem' }}>{error}</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ 
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: "8px"
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ 
                    fontWeight: "bold", 
                    color: "#333",
                    fontSize: "1rem"
                  }}>Thời gian</TableCell>
                  <TableCell sx={{ 
                    fontWeight: "bold", 
                    color: "#333",
                    fontSize: "1rem"
                  }}>Số tiền</TableCell>
                  <TableCell sx={{ 
                    fontWeight: "bold", 
                    color: "#333",
                    fontSize: "1rem"
                  }}>Ngân hàng</TableCell>
                  <TableCell sx={{ 
                    fontWeight: "bold", 
                    color: "#333",
                    fontSize: "1rem"
                  }}>Số tài khoản</TableCell>
                  <TableCell sx={{ 
                    fontWeight: "bold", 
                    color: "#333",
                    fontSize: "1rem"
                  }}>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((item) => (
                  <TableRow 
                    key={item._id}
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: "#fafafa" },
                      '&:hover': { backgroundColor: "#f0f0f0" }
                    }}
                  >
                    <TableCell sx={{ color: "#333" }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: "#333", fontWeight: "500" }}>
                      {item.amount.toLocaleString()} VNĐ
                    </TableCell>
                    <TableCell sx={{ color: "#333" }}>{item.bank}</TableCell>
                    <TableCell sx={{ color: "#333" }}>{item.accountNumber}</TableCell>
                    <TableCell sx={{ 
                      color: item.status === 'Đang xử lý' ? '#f57c00' : 
                             item.status === 'Thành công' ? '#2e7d32' : 
                             item.status === 'Từ chối' ? '#d32f2f' : '#333',
                      fontWeight: "500"
                    }}>
                      {item.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Layout>
  );
};

export default WithdrawHistory; 