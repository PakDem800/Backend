var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

router.get('/', async function (req, res, next) {
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
//create plot cancellation
router.post('/createPlotCancellationLetter', async function (req, res, next) {
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


module.exports = router;
