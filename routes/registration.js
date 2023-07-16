var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

router.get('/', async function (req, res, next) {
  try {
    const allregistrations = await prisma.registrationTbl.findMany();
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedregistrations = jsonSerializer.stringify(allregistrations);

    res.send(serializedregistrations);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
