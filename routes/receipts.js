const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { Prisma } = require('@prisma/client'); 
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


//Edit Receipt
router.put('/update', async function (req, res, next) {
  try {
    const receiptId = req.body.receiptId; // Assuming the receiptId is passed as "Id" in the request body
    console.log(receiptId)
    console.log(typeof(receiptId))
    if (isNaN(receiptId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid receiptId provided in the request body.',
      });
    }

    const Id = parseInt(receiptId)

    // Update the record with the new data from the request body
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
router.delete('/delete', async function (req, res, next) {
  try {
    const { receiptId } = req.body;

    if (!receiptId) {
      return res.status(400).json({
        success: false,
        message: 'receiptId is required in the request body.',
      });
    }

    const Id = parseInt(receiptId);

    console.log(typeof(Id));

    // Use Prisma client to delete the record
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
router.get('/details', async function (req, res, next) {
  try {
    const { receiptId } = req.body;

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

    res.status(200).json({
      success: true,
      data: serializedRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});



//all receipts
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
