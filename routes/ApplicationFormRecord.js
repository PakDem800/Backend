var express = require('express');
var router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

const jsonSerializer = JSONbig({ storeAsString: true });

router.get('/', async function (req, res, next) {
  try {
    const fileNo = '455';
    //will be req.body


    const result = await prisma.$queryRaw`
    SELECT
        m.Date,
        m.FileNo,
        m.Area,
        m.PlotNo,
        m.TotalAmount,
        m.DownPayment,
        a.AgentName,
        m.ApplicantName,
        SUM(r.ReceivedAmount) as ReceivedAmountSum
    FROM
        MainAppForm m
    LEFT JOIN
        AgentTbl a ON m.Agent = a.AgentID
    LEFT JOIN
        ReceiptTbl r ON m.FileNo = r.FileNo
    WHERE
        m.FileNo = ${fileNo}
    GROUP BY
        m.Date,
        m.FileNo,
        m.Area,
        m.PlotNo,
        m.TotalAmount,
        m.DownPayment,
        a.AgentName,
        m.ApplicantName;
    `;




    // Serialize the response using json-bigint
    const jsonSerializer = JSONbig({ storeAsString: true });
    const serializedResponse = jsonSerializer.stringify(result);
    res.send(serializedResponse);
    
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
