var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

const jsonSerializer = JSONbig({ storeAsString: true });
var { isAdmin,protect } = require('../middleware/authMiddleware')

router.get('/',protect,isAdmin, async function (req, res, next) {
  try {
    const allPricePlots = await prisma.plotPrice.findMany({
      select:{
        PlotPriceID:true,
        PlotCategory:true,
        PlotSize:true,
        PriceDate:true,
        PlotPrice:true,
        MonthlyInstallment:true,
        TotalMonthlyInstallments:true,
        Extra15Percent:true
      }
    });
    const jsonSerializer = JSONbig({ storeAsString: true });

    const PlotPrices = allPricePlots.map(item => ({
      ...item,
      PriceDate: item.PriceDate.toISOString().split('T')[0],
    }));

    // Serialize the BigInt values using json-bigint
    const serializedPricePlots = jsonSerializer.stringify(PlotPrices);

    res.send(serializedPricePlots);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Get 1 plot price
router.get('/details',protect,isAdmin, async function (req, res, next) {
  try {

    const  { PlotPriceID } = req.query

    const allPricePlots = await prisma.plotPrice.findFirst({
      where:{
        PlotPriceID : parseInt(PlotPriceID),
      }
    });
    const jsonSerializer = JSONbig({ storeAsString: true });

    PricePlot = {
      PlotPriceID: allPricePlots.PlotPriceID,
      PlotCategory: allPricePlots.PlotCategory,
      PlotSize: allPricePlots.PlotSize,
      PriceDate: allPricePlots.PriceDate.toISOString().split('T')[0],
      PlotPrice: allPricePlots.PlotPrice,
      MonthlyInstallment: allPricePlots.MonthlyInstallment,
      TotalMonthlyInstallments: allPricePlots.TotalMonthlyInstallments,
      Extra15Percent: allPricePlots.Extra15Percent,
      TokenMoney: allPricePlots.TokenMoney,
      ConfirmationAdvance: allPricePlots.ConfirmationAdvance,
      QuarterlyInstallment: allPricePlots.QuarterlyInstallment,
      TotalInstallmentQuarterly: allPricePlots.TotalInstallmentQuarterly,
    }
    

    // Serialize the BigInt values using json-bigint
    const serializedPricePlots = jsonSerializer.stringify(PricePlot);

    res.send(serializedPricePlots);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// create plot price
router.post('/createPlotPrice',protect,isAdmin, async function (req, res, next) {
  try {
    const {
      PlotCategory,
      PlotSize,
      PriceDate,
      PlotPrice,
      TokenMoney,
      ConfirmationAdvance,
      MonthlyInstallment,
      QuarterlyInstallment,
      TotalInstallmentQuarterly,
      TotalMonthlyInstallments,
      Extra15Percent,
    } = req.body;

    const data = {
      PlotCategory,
      PlotSize,
      PriceDate : new Date(PriceDate),
      PlotPrice,
      TokenMoney,
      ConfirmationAdvance,
      MonthlyInstallment,
      QuarterlyInstallment,
      TotalInstallmentQuarterly,
      TotalMonthlyInstallments,
      Extra15Percent,
    };

    console.log(data);

    // Now you can use 'data' to create a new PlotPrice record in the database.
    // For example, using Prisma:
    const newPlotPrice = await prisma.plotPrice.create({
      data: data,
    });

    console.log(newPlotPrice);
    const serializednewPlotPrice = jsonSerializer.stringify(newPlotPrice);

    res.status(200).json(serializednewPlotPrice);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//update
router.put('/update',protect,isAdmin, async function (req, res, next) {
  try {

    const  { 
      PlotPriceID ,
      PlotCategory,
      PlotSize,
      PriceDate,
      PlotPrice,
      TokenMoney,
      ConfirmationAdvance,
      MonthlyInstallment,
      QuarterlyInstallment,
      TotalInstallmentQuarterly,
      TotalMonthlyInstallments,
      Extra15Percent } = req.body

    const allPricePlots = await prisma.plotPrice.update({
      where:{
        PlotPriceID : parseInt(PlotPriceID),
      } ,
      data : {
        PlotCategory,
        PlotSize,
        PriceDate : new Date(PriceDate),
        PlotPrice,
        TokenMoney,
        ConfirmationAdvance,
        MonthlyInstallment,
        QuarterlyInstallment,
        TotalInstallmentQuarterly,
        TotalMonthlyInstallments,
        Extra15Percent
      }
    });
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedPricePlots = jsonSerializer.stringify(allPricePlots);

    res.send(serializedPricePlots);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Delete Plot Price
router.delete('/delete',protect,isAdmin, async function (req, res, next) {
  try {

    const  { PlotPriceID  } = req.body

    const allPricePlots = await prisma.plotPrice.delete({
      where:{
        PlotPriceID : parseInt(PlotPriceID),
      }
    });
    res.status(200).json({
      success: true,
      message: `Plot Price with PlotPriceID ${PlotPriceID} has been deleted successfully.`
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
