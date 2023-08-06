var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });
var { isAdmin,protect } = require('../middleware/authMiddleware')

router.get('/',protect, isAdmin,async function (req, res, next) {
  try {
    const allPlots = await prisma.plotsTbl.findMany({
      select:{
        PlotID:true,
        Plots:true,
        PlotNo:true,
        Block:true,
        sold:true

      }
    });
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedPlots = jsonSerializer.stringify(allPlots);

    res.send(serializedPlots);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//View 1 plot
router.get('/details',protect,isAdmin, async function (req, res, next) {
  try {

    const { PlotID } = req.query

    const allPlots = await prisma.plotsTbl.findFirst({
      where:{
        PlotID : parseInt(PlotID)
      }
    });
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
router.post('/createPlot',protect,isAdmin, async function (req, res, next) {
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

//Update plots
router.put('/update',protect,isAdmin, async function (req, res, next) {
  try {

    const  { 
      PlotID ,
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
      TotalMonthlyInstallment 
        } = req.body

    const UpdatedPlot = await prisma.plotsTbl.update({
      where:{
        PlotID : parseInt(PlotID)
      },
      data: {
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
      TotalMonthlyInstallment 
      }
    });
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedUpdatedPlot = jsonSerializer.stringify(UpdatedPlot);

    res.send(serializedUpdatedPlot);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.delete('/delete',protect,isAdmin, async function (req, res, next) {
  try {

    const  { PlotID  } = req.body

    const allPricePlots = await prisma.plotsTbl.delete({
      where:{
        PlotID : parseInt(PlotID),
      }
    });
    res.status(200).json({
      success: true,
      message: `Plot Price with PlotID ${PlotID} has been deleted successfully.`
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});



module.exports = router;
