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

module.exports = router;
