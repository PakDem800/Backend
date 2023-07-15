var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

var plotPriceRouter = require('./routes/PlotPrice')
var allotmentformRouter = require('./routes/allotmentform')
var commissionRouter = require('./routes/commission')
var ledgerRouter = require('./routes/ledger')
var expenditureRouter = require('./routes/expenditure')
var plotRouter = require('./routes/Plots')
var AgentRouter = require('./routes/Agents')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/allotmentForm',allotmentformRouter)
app.use('/commission' , commissionRouter)
app.use('/ledger' , ledgerRouter)
app.use('/expenditure',expenditureRouter)
app.use('/plotprice',plotPriceRouter)
app.use('/Plots' , plotRouter)
app.use('/Agents' , AgentRouter)

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
  res.render('error');
});

module.exports = app;
