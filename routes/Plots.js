var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

router.get('/', async function (req, res, next) {
  try {
    const allPlots = await prisma.plotsTbl.findMany();
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedPlots = jsonSerializer.stringify(allPlots);

    res.send(serializedPlots);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//create plots
router.post('/createPlot', async function (req, res, next) {
  try {
    const {
      ProjectID,
      PlotPrice,
      PlotNo,
      Plots,
      PlotSize,
      Street,
      Phase,
      Block,
      Category,
      PlotLocation,
      Amount,
      PlotStatus,
      sold,
      TokenMoney,
      CornfirmationAdvance,
      MonthlyInstallment,
      QuarterlyInstallment,
      Extra15Percent,
      TotalQuarterlyInstallment,
      TotalMonthlyInstallment,
    } = req.body;

    const data = {
      ProjectID,
      PlotPrice,
      PlotNo,
      Plots,
      PlotSize,
      Street,
      Phase,
      Block,
      Category,
      PlotLocation,
      Amount,
      PlotStatus,
      sold,
      TokenMoney,
      CornfirmationAdvance,
      MonthlyInstallment,
      QuarterlyInstallment,
      Extra15Percent,
      TotalQuarterlyInstallment,
      TotalMonthlyInstallment,
    };

    console.log(data);

   
    const newPlot = await prisma.plotsTbl.create({
      data: data,
    });

    console.log(newPlot);
    const serializedNewPlot = jsonSerializer.stringify(newPlot);

    res.status(200).json(serializedNewPlot);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
