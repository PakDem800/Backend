var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

router.get('/', async function (req, res, next) {
  try {
    const allAgents = await prisma.agentTbl.findMany();
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedallAgents = jsonSerializer.stringify(allAgents);

    res.send(serializedallAgents);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
//create agents
router.post('/createAgent', async function (req, res, next) {
  try {
    const {
      RegistrationDate,
      AgentName,
      AgentCNICNo,
      AgentFatherName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      Phone,
      Email,
      CommissionPercentage,
      DownPaymentCommission,
      InstallmentCommission,
      OpeningBalance,
      OpeningBalanceDate,
    } = req.body;

    const data = {
      RegistrationDate,
      AgentName,
      AgentCNICNo,
      AgentFatherName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      Phone,
      Email,
      CommissionPercentage,
      DownPaymentCommission,
      InstallmentCommission,
      OpeningBalance,
      OpeningBalanceDate,
    };

    console.log(data);

    // Now you can use 'data' to create a new AgentTbl record in the database.
    // For example, using Prisma:
    const newAgent = await prisma.agentTbl.create({
      data: data,
    });

    console.log(newAgent);
    const serializedNewAgent = jsonSerializer.stringify(newAgent);

    res.status(200).json(serializedNewAgent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
