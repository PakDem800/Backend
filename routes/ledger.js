const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
var { isAdmin , protect } = require('../middleware/authMiddleware')
const jsonSerializer = JSONbig({ storeAsString: true });

// Ledger Report
router.get('/',protect, async function (req, res, next) {
    try {
        const allreceipt = await prisma.receiptTbl.findMany();

        const ledger = allreceipt.map((item) => {
          return {
            id: item.Id,
            Receipt_No: item.ReceiptNo,
            File_no: item.FileNo,
            Date: item.Date.toISOString().split('T')[0],
            Amount: item.ReceivedAmount,
            Recieved_From: item.ReceivedFrom,
            Payment_Mode : item.ModeOfPayment,
            Corner_Charges : 0,
            Grand_Total : 0
          }
        })

        const serializedallreceipt = jsonSerializer.stringify(ledger);
    
        res.send(serializedallreceipt);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});



module.exports = router;