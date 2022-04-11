var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/indexRouter');
var loginRouter = require('./routes/loginRoutes');
var uvmRouter = require('./routes/uvmRoutes');
var voucherRouter = require('./routes/voucherRouter');

var favicon = require('serve-favicon');

var app = express();
app.use(cors());

app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','cropped-Lincoln_Logotipo-2-32x32.ico')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/uvm', uvmRouter);
app.use('/voucher', voucherRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('page-error');
});

module.exports = app;
