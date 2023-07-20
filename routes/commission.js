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

//Create Vouchers
router.post('/createVoucher', async function (req, res, next) {
  try {
    const {
      FileNo,
      VoucherDate,
      Agent,
      Amount,
      Description,
      CommissionPercentage,
      CommissionType,
      BBF,
      VoucherNo
    } = req.body;

    const data = {
      FileNo,
      VoucherDate,
      Agent,
      Amount,
      Description,
      CommissionPercentage,
      CommissionType,
      BBF,
      VoucherNo
    };

    console.log(data);

    // Now you can use 'data' to create a new RefundTbl record in the database.
    // For example, using Prisma:
    const newVoucher = await prisma.voucherTbl.create({
      data: data,
    });
    console.log(newVoucher);
    const serializednewVoucher = jsonSerializer.stringify(newVoucher);

    res.status(200).json(serializednewVoucher);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;