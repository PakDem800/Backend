var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

const jsonSerializer = JSONbig({ storeAsString: true });

router.get('/', async function (req, res, next) {
  try {
    const allPlots = await prisma.plotAllotmentTbl.findMany();
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedPlots = jsonSerializer.stringify(allPlots);

    res.send(serializedPlots);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Get 1 Details
router.get('/details', async function (req, res, next) {
  try {
    const allPlots = await prisma.plotAllotmentTbl.findFirst({
      where:{
        PlotAllotmentID : parseInt(req.body.PlotAllotmentID)
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

//create 
router.post('/create', async function (req, res, next) {
  try {
    const {
      AllotmentDate,
      AllotmentTime,
      FileNo,
      PlotID,
      IsActive,
    } = req.body;

    const data = {
      AllotmentDate : new Date(AllotmentDate),
      AllotmentTime :new Date(AllotmentTime),
      FileNo,
      PlotID,
      IsActive,
    };

    console.log(data);

    const newPlotAllotment = await prisma.plotAllotmentTbl.create({
      data: data,
    });

    console.log(newPlotAllotment);
    const serializedNewPlotAllotment = jsonSerializer.stringify(newPlotAllotment);

    res.status(200).json(serializedNewPlotAllotment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/update', async function (req, res, next) {
  try {
    const {
      PlotAllotmentID,
      AllotmentDate,
      AllotmentTime,
      FileNo,
      PlotID,
      IsActive,
    } = req.body;

    const data = {
      AllotmentDate : new Date(AllotmentDate),
      AllotmentTime :new Date(AllotmentTime),
      FileNo,
      PlotID,
      IsActive,
    };

    console.log(data);

    // Now you can use 'data' to create a new PlotAllotmentTbl record in the database.
    // For example, using Prisma:
    const newPlotAllotment = await prisma.plotAllotmentTbl.update({
      where :{
          PlotAllotmentID : parseInt(PlotAllotmentID)
      },
      data: data,
    });

    console.log(newPlotAllotment);
    const serializedNewPlotAllotment = jsonSerializer.stringify(newPlotAllotment);

    res.status(200).json(serializedNewPlotAllotment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Delete
router.delete('/delete', async function (req, res, next) {
  try {


    const PlotAllotment = await prisma.plotAllotmentTbl.delete({
      where:{
        PlotAllotmentID : parseInt(req.body.PlotAllotmentID),
      }
    });
    res.status(200).json({
      success: true,
      message: `plot Allotment Letter has been deleted successfully.`
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;