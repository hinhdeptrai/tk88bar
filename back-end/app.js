require('dotenv').config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");

const app = express();
const http = require("http");
const { NotFoundError } = require("./utils/app_error");
const errorController = require("./controllers/error_controller");
const adminRouters = require("./routers/admin.routers");
const thongBaoRouters = require("./routers/thongbao.routers");
const nguoiDungRouters = require("./routers/nguoidung.routers");
const heThongRouters = require("./routers/hethong_routers");
const bienDongSoDuRouters = require("./routers/biendongsodu.routers");
const gameKeno1PRouters = require("./routers/game.keno.1p.routers");
const gameKeno3PRouters = require("./routers/game.keno.3p.routers");
const gameKeno5PRouters = require("./routers/game.keno.5p.routers");
const lienKetNganHangRouters = require("./routers/lienketnganhang.routers");
const gameXucXac1PRouters = require("./routers/game.xucxac.1p.routers");
const gameXucXac3PRouters = require("./routers/game.xucxac.3p.routers");
const gameXocDia1PRouters = require("./routers/game.xocdia.1p.routers");
const withdrawRouter = require('./routers/withdraw.router');
const notificationRouter = require('./routers/notification.router');
const authenticateUser = require('./middleware/authenticate');

//MIDDLEWARE
app.use(cors({
  origin: ['http://159.223.94.32:3002', 'http://159.223.94.32:8082'],
  credentials: true
}));

//security http
app.use(helmet());

//limit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 1000,
  skip: (req) => {
    return process.env.NODE_ENV === 'development' && req.ip === '::1';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Quá nhiều yêu cầu, vui lòng thử lại sau 1 phút"
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

///// body parser in , reading data from body
app.use(express.json());

//against NoSQL Injection
app.use(mongoSanitize());

//against XSS (HTML, JS)
app.use(xss());

//serving static file
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req, res, next) => {
  req.timeNow = new Date().toISOString();
  next();
});

//routers
app.get("/", (req, res) => {
  res.status(200).send("Server đang chạy thành công");
});

app.use("/api/v1/admin", adminRouters);
app.use("/api/v1/hethong", heThongRouters);
app.use("/api/v1/thongbao", thongBaoRouters);
app.use("/api/v1/nguoidung", nguoiDungRouters);
app.use("/api/v1/biendongsodu", bienDongSoDuRouters);
app.use("/api/v1/lienketnganhang", lienKetNganHangRouters);
app.use("/api/v1/games/keno1p", gameKeno1PRouters);
app.use("/api/v1/games/keno3p", gameKeno3PRouters);
app.use("/api/v1/games/keno5p", gameKeno5PRouters);
app.use("/api/v1/games/xucxac1p", gameXucXac1PRouters);
app.use("/api/v1/games/xucxac3p", gameXucXac3PRouters);
app.use("/api/v1/games/xocdia1p", gameXocDia1PRouters);
app.use('/api/v1/withdraw', withdrawRouter);
app.use('/api/v1/notifications', notificationRouter);

app.all("*", (req, res, next) => {
  next(new NotFoundError(`No found ${req.originalUrl}`));
});

app.use(errorController);
module.exports = app;
