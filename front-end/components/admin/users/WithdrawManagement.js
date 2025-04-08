import { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import Layout from "../Layout";

const WithdrawManagement = () => {
  const [history, setHistory] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/v1/withdraw/admin/history');
        const result = await response.json();
        if (result.success) {
          setHistory(result.data);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistory();
  }, []);

  const handleUpdate = async (id) => {
    try {
      const response = await fetch('http://localhost:8082/api/v1/withdraw/admin/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: editStatus, note: editNote }),
      });
      const result = await response.json();
      if (result.success) {
        setHistory(history.map(item => item.id === id ? { ...item, status: editStatus, note: editNote } : item));
        setEditId(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: "2rem", backgroundColor: "#fff", borderRadius: "8px" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#333" }}>
          Quản lý rút tiền
        </Typography>
        {history.map((item) => (
          <Box key={item.id} sx={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
            <Typography sx={{ color: "#333" }}>Số tiền: {item.amount}</Typography>
            <Typography sx={{ color: "#333" }}>Ngân hàng: {item.bank}</Typography>
            <Typography sx={{ color: "#333" }}>Số tài khoản: {item.accountNumber}</Typography>
            <Typography sx={{ color: "#333" }}>Trạng thái: {item.status}</Typography>
            <Typography sx={{ color: "#333" }}>Ghi chú: {item.note}</Typography>
            {editId === item.id ? (
              <Box>
                <TextField label="Trạng thái" value={editStatus} onChange={(e) => setEditStatus(e.target.value)} />
                <TextField label="Ghi chú" value={editNote} onChange={(e) => setEditNote(e.target.value)} />
                <Button onClick={() => handleUpdate(item.id)}>Cập nhật</Button>
              </Box>
            ) : (
              <Button onClick={() => {
                setEditId(item.id);
                setEditStatus(item.status);
                setEditNote(item.note);
              }}>Chỉnh sửa</Button>
            )}
          </Box>
        ))}
      </Box>
    </Layout>
  );
};

export default WithdrawManagement; 