const mongoose = require('mongoose');

// Định nghĩa schema cho Withdrawal
const withdrawalSchema = new mongoose.Schema({
  username: { type: String, required: true },
  amount: { type: Number, required: true },
  bank: { type: String, required: true },
  accountNumber: { type: String, required: true },
  status: { type: String, default: 'Đang xử lý' },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

const withdraw = async (req, res) => {
  try {
    const { amount, bank, accountNumber, username } = req.body;
    
    // Tạo yêu cầu rút tiền mới
    const newWithdrawal = new Withdrawal({
      username,
      amount,
      bank,
      accountNumber,
      status: 'Đang xử lý'
    });

    await newWithdrawal.save();
    return res.status(201).json({ 
      success: true, 
      message: 'Yêu cầu rút tiền đã được tạo',
      data: newWithdrawal 
    });
  } catch (error) {
    console.error('Lỗi khi tạo yêu cầu rút tiền:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

const getWithdrawHistory = async (req, res) => {
  try {
    const history = await Withdrawal.find()
      .sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử rút tiền:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

const getAllWithdrawHistory = async (req, res) => {
  try {
    const history = await Withdrawal.find()
      .sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Lỗi khi lấy tất cả lịch sử rút tiền:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

const updateWithdrawStatus = async (req, res) => {
  try {
    const { id, status, note } = req.body;
    const withdrawal = await Withdrawal.findById(id);
    
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu rút tiền" });
    }

    withdrawal.status = status;
    withdrawal.note = note;
    await withdrawal.save();

    return res.status(200).json({ 
      success: true, 
      message: 'Cập nhật trạng thái thành công',
      data: withdrawal 
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

const deleteWithdraw = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await Withdrawal.findByIdAndDelete(id);
    
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu rút tiền" });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Xóa yêu cầu rút tiền thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa yêu cầu rút tiền:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

module.exports = { withdraw, getWithdrawHistory, getAllWithdrawHistory, updateWithdrawStatus, deleteWithdraw };