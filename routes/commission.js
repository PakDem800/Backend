const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });

// vouchers
router.get('/vouchers', async function (req, res, next) {
  try {
    const allvouchers = await prisma.voucherTbl.findMany();
    const serializedallvouchers = jsonSerializer.stringify(allvouchers);

    res.send(serializedallvouchers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;