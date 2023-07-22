const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const jsonSerializer = JSONbig({ storeAsString: true });
const prisma = new PrismaClient();

router.get('/', async function (req, res, next) {
  try {
    const agentName = 'Iqbal Shah';

    const mainForms = await prisma.$queryRaw`
      SELECT
        main.Date,
        main.FileNo,
        main.Area,
        main.PlotNo,
        main.TotalAmount,
        main.DownPayment,
        agent.AgentName,
        main.ApplicantName
      FROM
        MainAppForm main
      INNER JOIN
        AgentTbl agent ON main.Agent = agent.AgentID
      WHERE
        agent.AgentName = ${agentName}
    `;

    const jsonSerializer = JSONbig({ storeAsString: true });
    const serializedmainForms = jsonSerializer.stringify(mainForms);
    res.send(serializedmainForms);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
