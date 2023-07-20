const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });

// regular receipt
router.get('/regularReceipt', async function (req, res, next) {
  try {
    const receiptType = 1;
    // Set the filter value to 15000

    // Prisma query to retrieve refund records with ReceivedAmount = 15000
    const allMainForm = await prisma.receiptTbl.findMany({
      where: {
        ReceiptType : 1
      },
    });

    const serializedMainAppForm = jsonSerializer.stringify(allMainForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
//transfer receipt
// transfer receipt with ReceivedAmount filter
router.get('/transferReceipt', async function (req, res, next) {
  try {
    const receiptType = 2; 
    // Set the filter value to 15000

    // Prisma query to retrieve refund records with ReceivedAmount = 15000
    const allMainForm = await prisma.receiptTbl.findMany({
      where: {
        ReceiptType: receiptType,
      },
    });

    const serializedMainAppForm = jsonSerializer.stringify(allMainForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Development receipt
router.get('/DevelopmentReceipt', async function (req, res, next) {
  try {



    const allMainForm = await prisma.receiptTbl.findMany({
      where: {
        ReceiptType : 3
      },
    });

    const serializedMainAppForm = jsonSerializer.stringify(allMainForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});





router.get('/receipt', async function(req,res,next){
    try {
        const receipt = await prisma.receiptTbl.findMany();
        const serializedreceipt = jsonSerializer.stringify(receipt);
    
        res.send(serializedreceipt);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});

//Create Receipt
//receipt record finder
router.post('/createReceipt', async function (req, res, next) {
  try {
    const {
      ReceiptNo,
      FileNo,
      date,
      ReceivedAmount,
      ReceivedDifferenceAmount,
      ReceivedFrom,
      Amount_For_The_Month_Of,
      AmountReceivedForPlot,
      ModeOfPayment,
      Receipt,
      Phase,
      Block,
      Plot_No,
      Prepaired_By,
      Prepaired_by_Name,
      Remarks,
      Balancamount,
      ReceiptCatgory,
      ReceiptStatus,
      NextDueDate,
      AgentID,
      AgentName,
      CommAmount,
      CommRemarks,
      ReceiptType, 
    } = req.body;

    const data = {
      ReceiptNo,
      FileNo,
      Date : new Date(date),
      ReceivedAmount,
      ReceivedDifferenceAmount,
      ReceivedFrom,
      Amount_For_The_Month_Of,
      AmountReceivedForPlot,
      ModeOfPayment,
      Receipt,
      Phase,
      Block,
      Plot_No,
      Prepaired_By,
      Prepaired_by_Name,
      Remarks,
      Balancamount,
      ReceiptCatgory,
      ReceiptStatus,
      NextDueDate,
      AgentID,
      AgentName,
      CommAmount,
      CommRemarks,
      ReceiptType, 
    };

    console.log(data);

    const newReceipt = await prisma.receiptTbl.create({
      data: data,
    });
    console.log(newReceipt);
    const serializednewReceipt = jsonSerializer.stringify(newReceipt);

    res.status(200).json(serializednewReceipt);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
