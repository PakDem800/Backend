const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');
const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });
var { protect } = require('../middleware/authMiddleware')

router.get('/',protect, async function (req, res, next) {
  try {
    const {fileNo} = req.body

    const receipts = await prisma.receiptTbl.findMany({
      where: {
        FileNo: fileNo,
      },
      select: {
        Date: true,
        FileNo: true,
        ReceivedAmount: true,
        AgentName: true,
        Amount_For_The_Month_Of: true,
        
        ModeOfPayment: true,
        Phase: true,
        Block: true,
        Plot_No: true,
        Prepaired_by_Name: true,
        Remarks: true,
        Balancamount: true,
        ReceiptCatgory: true,
        ReceiptStatus: true,
        NextDueDate: true,
        CommAmount: true,
        CommRemarks: true,
      },
    });
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedreceipts = jsonSerializer.stringify(receipts);

    res.send(serializedreceipts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
