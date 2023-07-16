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

module.exports = router;
