const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { Prisma } = require('@prisma/client'); 
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });
var { protect ,isAdmin } = require('../middleware/authMiddleware')

// regular receipt
router.get('/regularReceipt',protect, async function (req, res, next) {
  try {

    // Prisma query to retrieve refund records with ReceivedAmount = 15000
    const allMainForm = await prisma.receiptTbl.findMany({
      where: {
        ReceiptType : 1
      },
      select : {
        Id:true,
        FileNo : true,
        Date : true,
        ReceivedAmount : true,
        ReceivedFrom:true,
        Amount_For_The_Month_Of : true,
        Receipt:true,
        Plot_No:true,
        Remarks:true
      }
    });
    const MainAppForm = allMainForm.map(item => ({
      ...item,
      Date: item.Date.toISOString().split('T')[0],
    }));

    const serializedMainAppForm = jsonSerializer.stringify(MainAppForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//transfer receipt
// transfer receipt with ReceivedAmount filter
router.get('/transferReceipt',protect, async function (req, res, next) {
  try {

    // Prisma query to retrieve refund records with ReceivedAmount = 15000
    const allMainForm = await prisma.receiptTbl.findMany({
      where: {
        ReceiptType : 2
      },
      select : {
        Id:true,
        FileNo : true,
        Date : true,
        ReceivedAmount : true,
        ReceivedFrom:true,
        Amount_For_The_Month_Of : true,
        Receipt:true,
        Plot_No:true,
        Remarks:true
      }
    });
    const MainAppForm = allMainForm.map(item => ({
      ...item,
      Date: item.Date.toISOString().split('T')[0],
    }));

    const serializedMainAppForm = jsonSerializer.stringify(MainAppForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Development receipt
router.get('/DevelopmentReceipt',protect, async function (req, res, next) {
  try {

    // Prisma query to retrieve refund records with ReceivedAmount = 15000
    const allMainForm = await prisma.receiptTbl.findMany({
      where: {
        ReceiptType : 3
      },
      select : {
        Id:true,
        FileNo : true,
        Date : true,
        ReceivedAmount : true,
        ReceivedFrom:true,
        Amount_For_The_Month_Of : true,
        Receipt:true,
        Plot_No:true,
        Remarks:true
      }
    });
    const MainAppForm = allMainForm.map(item => ({
      ...item,
      Date: item.Date.toISOString().split('T')[0],
    }));

    const serializedMainAppForm = jsonSerializer.stringify(MainAppForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//Edit Receipt
router.put('/update', protect,isAdmin, async function (req, res, next) {
  try {
    const receiptId = req.body.receiptId; 

    if (isNaN(receiptId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid receiptId provided in the request body.',
      });
    }

    const Id = parseInt(receiptId)

    const updatedRecord = await prisma.receiptTbl.update({
      where: {
        Id: Id,
      },
      data: {
        ReceiptNo: req.body.ReceiptNo,
        FileNo: req.body.FileNo,
        Date: new Date(req.body.date),
        ReceivedAmount: req.body.ReceivedAmount,
        ReceivedDifferenceAmount: req.body.ReceivedDifferenceAmount,
        ReceivedFrom: req.body.ReceivedFrom,
        Amount_For_The_Month_Of: req.body.Amount_For_The_Month_Of,
        AmountReceivedForPlot: req.body.AmountReceivedForPlot,
        ModeOfPayment: req.body.ModeOfPayment,
        Receipt: req.body.Receipt,
        Phase: req.body.Phase,
        Block: req.body.Block,
        Plot_No: req.body.Plot_No,
        Prepaired_By: req.body.Prepaired_By,
        Prepaired_by_Name: req.body.Prepaired_by_Name,
        Remarks: req.body.Remarks,
        Balancamount: req.body.Balancamount,
        ReceiptCatgory: req.body.ReceiptCatgory,
        ReceiptStatus: req.body.ReceiptStatus,
        NextDueDate: new Date(req.body.NextDueDate),
        AgentID: req.body.AgentID,
        AgentName: req.body.AgentName,
        CommAmount: req.body.CommAmount,
        CommRemarks: req.body.CommRemarks,
        ReceiptType: req.body.receiptType
      },
    });

    const serializedupdatedRecord = jsonSerializer.stringify(updatedRecord);

    res.status(200).json({
      success: true,
      message: `Receipt record with ID ${receiptId} has been updated successfully.`,
      updatedRecord: serializedupdatedRecord,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      // If the error is due to non-existent record, return 404 status
      return res.status(404).json({
        success: false,
        message: 'Receipt record to update does not exist.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});


//Delete Receipt
router.delete('/delete',protect,isAdmin, async function (req, res, next) {
  try {
    const { receiptId } = req.body;

    if (!receiptId) {
      return res.status(400).json({
        success: false,
        message: 'receiptId is required in the request body.',
      });
    }

    const Id = parseInt(receiptId);

    const deletedRecord = await prisma.receiptTbl.delete({
      where: {
        Id: Id,
      },
    });

    res.status(200).json({
      success: true,
      message: `Record with Id ${Id} has been deleted successfully.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

//Get 1 receipt
router.get('/details',protect, async function (req, res, next) {
  try {
    const { receiptId } = req.query;

    if (!receiptId) {
      return res.status(400).json({
        success: false,
        message: 'receiptId is required in the request body.',
      });
    }

    const Id = parseInt(receiptId);

    console.log(typeof(Id));

    // Use Prisma client to delete the record
    const Record = await prisma.receiptTbl.findFirst({
      where: {
        Id: Id,
      },
    });

    const serializedRecord = jsonSerializer.stringify(Record);

    res.send(serializedRecord)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});



//all receipts
router.get('/receipt',protect, async function(req,res,next){
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
router.post('/createReceipt',protect, async function (req, res, next) {
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
      NextDueDate : new Date(NextDueDate),
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
