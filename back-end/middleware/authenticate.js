const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  try {
    console.log('Headers:', req.headers); // Log tất cả headers
    
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Không tìm thấy token trong headers'); // Log khi không có token
      return res.status(401).json({ 
        success: false, 
        message: 'Không tìm thấy token xác thực' 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token nhận được:', token); // Log token để debug
    
    // Xác thực token với NEXTAUTH_SECRET
    const decoded = jwt.verify(token, '5fb7e8d4a23b4c158529a0e3879957ed25b379c7f8c2f82a8728d43b0bc25c38');
    console.log('Token đã giải mã:', decoded); // Log thông tin đã giải mã
    
    // Gán thông tin người dùng vào request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token đã hết hạn' 
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Lỗi xác thực' 
    });
  }
};

module.exports = authenticateUser; 