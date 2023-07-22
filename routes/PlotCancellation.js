var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });
var { isAdmin,protect } = require('../middleware/authMiddleware')

router.get('/', protect,isAdmin,async function (req, res, next) {
  try {
    const allPlots = await prisma.plotCancellationLetter.findMany();
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedPlots = jsonSerializer.stringify(allPlots);

    res.send(serializedPlots);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/details', async function (req, res, next) {
  try {
    const allPlots = await prisma.plotCancellationLetter.findFirst({
      where:{
        PlotCancelID : parseInt(req.body.PlotCancelID)
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

//create plot cancellation
router.post('/create',protect,isAdmin, async function (req, res, next) {
  try {
    const {
      PlotID,
      CancellationDate,
      AmountNotPaid,
      ReasonForCancellation,
    } = req.body;

    const data = {
      PlotID,
      CancellationDate,
      AmountNotPaid,
      ReasonForCancellation,
    };

    console.log(data);

    // Now you can use 'data' to create a new PlotCancellationLetter record in the database.
    // For example, using Prisma:
    const newPlotCancellationLetter = await prisma.plotCancellationLetter.create({
      data: data,
    });

    console.log(newPlotCancellationLetter);
    const serializedNewPlotCancellationLetter = jsonSerializer.stringify(newPlotCancellationLetter);

    res.status(200).json(serializedNewPlotCancellationLetter);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//create plot cancellation
router.put('/Update',protect,isAdmin, async function (req, res, next) {
  try {
    const {
      PlotCancelID,
      PlotID,
      CancellationDate,
      AmountNotPaid,
      ReasonForCancellation,
    } = req.body;

    const data = {
      PlotID,
      CancellationDate : new Date(CancellationDate),
      AmountNotPaid,
      ReasonForCancellation,
    };

    console.log(data);

    const updatePlotCancellationLetter = await prisma.plotCancellationLetter.update({
      where:{
        PlotCancelID : parseInt(PlotCancelID)
      },
      data: data,
    });
    console.log(updatePlotCancellationLetter);
    const serializedupdatePlotCancellationLetter = jsonSerializer.stringify(updatePlotCancellationLetter);
    res.status(200).json(serializedupdatePlotCancellationLetter);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Delete
router.delete('/delete',protect,isAdmin, async function (req, res, next) {
  try {


    const PlotCancel = await prisma.plotCancellationLetter.delete({
      where:{
        PlotCancelID : parseInt(req.body.PlotCancelID),
      }
    });
    res.status(200).json({
      success: true,
      message: `plot Cancellation Letter has been deleted successfully.`
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
