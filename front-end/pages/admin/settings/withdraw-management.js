import { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import Layout from "../../../components/admin/Layout";

const WithdrawManagement = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNote, setEditNote] = useState("");

  const fetchHistory = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8082/api/v1/withdraw/admin/history');
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

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditStatus(item.status);
    setEditNote(item.note || "");
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn xóa yêu cầu rút tiền này?")) return;

    try {
      const response = await fetch(`http://localhost:8082/api/v1/withdraw/admin/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa yêu cầu rút tiền');
      }

      // Cập nhật lại danh sách sau khi xóa
      fetchHistory();
    } catch (err) {
      alert('Lỗi khi xóa: ' + err.message);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/v1/withdraw/admin/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedItem._id,
          status: editStatus,
          note: editNote
        })
      });

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái');
      }

      // Cập nhật lại danh sách sau khi sửa
      fetchHistory();
      setOpenEditDialog(false);
    } catch (err) {
      alert('Lỗi khi cập nhật: ' + err.message);
    }
  };

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
          Quản lý rút tiền
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
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Thời gian</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Người dùng</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Số tiền</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Ngân hàng</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Số tài khoản</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Ghi chú</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Thao tác</TableCell>
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
                    <TableCell sx={{ color: "#333" }}>{item.username}</TableCell>
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
                    <TableCell sx={{ color: "#333" }}>{item.note}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          onClick={() => handleEdit(item)}
                        >
                          Sửa
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error" 
                          size="small"
                          onClick={() => handleDelete(item._id)}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Dialog chỉnh sửa trạng thái */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Cập nhật trạng thái rút tiền</DialogTitle>
        <DialogContent>
          <Box sx={{ width: 400, pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                <MenuItem value="Thành công">Thành công</MenuItem>
                <MenuItem value="Từ chối">Từ chối</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Ghi chú"
              multiline
              rows={4}
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default WithdrawManagement; 