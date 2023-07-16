var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

router.get('/', async function (req, res, next) {
  try {
    const agentsAndVouchers = await prisma.agentTbl.findMany({
      select: {
        AgentName: true,
        VoucherTbl: {
          select: {
            VoucherID: true,
            FileNo: true,
            VoucherDate: true,
            Amount: true,
            Description: true,
          },
        },
      },
    });

    const agentsWithData = agentsAndVouchers.filter(agent => agent.VoucherTbl.length > 0);

    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedData = jsonSerializer.stringify(agentsWithData);

    res.send(serializedData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
