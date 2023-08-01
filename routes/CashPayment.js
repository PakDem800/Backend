const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

var { protect } = require('../middleware/authMiddleware')

const jsonSerializer = JSONbig({ storeAsString: true });

router.get('/', protect, async function (req, res, next) {
  try {
    const { startDate, endDate } = req.query; // Use req.query to access the query parameters

    if (startDate && endDate) {
      const sdate = new Date(startDate);
      const edate = new Date(endDate);

      const payments = await prisma.$queryRaw`
        SELECT
          rt."Id" ,
          mf."ApplicationNo",
          mf."Date",
          mf."FileNo",  
          mf."ApplicantName",
          rt."ModeOfPayment",
          rt."ReceivedAmount",
          mf."PlotNo",
          ag."AgentName"
        FROM "MainAppForm" AS mf
        JOIN "AgentTbl" AS ag
        ON mf."Agent" = ag."AgentID"
        JOIN "ReceiptTbl" AS rt
        ON mf."FileNo" = rt."FileNo"
        WHERE rt."ModeOfPayment" = 'Cash'
        AND (rt."Date" BETWEEN ${sdate} AND ${edate})
      `;
      
      const Cashpayments = payments.map(item => ({
        ...item,
        Date: item.Date.toISOString().split('T')[0],
      }));

      const jsonSerializer = JSONbig({ storeAsString: true });
      const serializedPayments = jsonSerializer.stringify(Cashpayments);
      res.send(serializedPayments);
    } else {
      const payments = await prisma.$queryRaw`
        SELECT 
          rt."Id" ,
          mf."ApplicationNo",
          mf."Date",
          mf."FileNo",  
          mf."ApplicantName",
          rt."ModeOfPayment",
          rt."ReceivedAmount",
          mf."PlotNo",
          ag."AgentName"
        FROM "MainAppForm" AS mf
        JOIN "AgentTbl" AS ag
        ON mf."Agent" = ag."AgentID"
        JOIN "ReceiptTbl" AS rt
        ON mf."FileNo" = rt."FileNo"
        ON mf."FileNo" = rt."FileNo"
        WHERE rt."ModeOfPayment" = 'Cash'
      `;
      
      const Cashpayments = payments.map(item => ({
        ...item,
        Date: item.Date.toISOString().split('T')[0],
      }));

      const jsonSerializer = JSONbig({ storeAsString: true });
      const serializedPayments = jsonSerializer.stringify(Cashpayments);
      res.send(serializedPayments);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});






module.exports = router;
