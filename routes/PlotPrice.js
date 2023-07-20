var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

router.get('/', async function (req, res, next) {
  try {
    const allPricePlots = await prisma.plotPrice.findMany();
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedPricePlots = jsonSerializer.stringify(allPricePlots);

    res.send(serializedPricePlots);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// create plot price
router.post('/createPlotPrice', async function (req, res, next) {
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
      PriceDate,
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


module.exports = router;
