var express = require('express');
var router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

router.get('/', async function (req, res, next) {
  try {
    const agentName = 'Iqbal Shah';
    // will be req.body later on; also, prisma is case sensitive 

    const agentVouchers = await prisma.agentTbl.findFirst({
      where: {
        AgentName: agentName, // Perform a case-insensitive comparison later on if needed
      },
      include: {
        VoucherTbl: true,
      },
    });

    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedAgentVouchers = jsonSerializer.stringify(agentVouchers);

    res.send(serializedAgentVouchers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//create agent payment voucher
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
      VoucherNo,
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
      VoucherNo,
    };

    console.log(data);

    // Now you can use 'data' to create a new VoucherTbl record in the database.
    // For example, using Prisma:
    const newVoucher = await prisma.voucherTbl.create({
      data: data,
    });

    console.log(newVoucher);
    const serializedNewVoucher = jsonSerializer.stringify(newVoucher);

    res.status(200).json(serializedNewVoucher);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
