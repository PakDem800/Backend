const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

var { isAdmin,protect } = require('../middleware/authMiddleware')

const jsonSerializer = JSONbig({ storeAsString: true });

router.get('/',protect,isAdmin, async function (req, res, next) {
  try {
    //will be from user
    const {startDate ,endDate} = req.body;


    const mainForms = await prisma.mainAppForm.findMany({
      where: {
        Date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        ApplicationNo: true,
        ApplicantName: true,
        FileNo: true,
      },
    });

    const receipts = await prisma.receiptTbl.findMany({
      where: {
        Date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        Id: true,
        ReceiptNo: true,
        FileNo: true,
        Date: true,
        ReceivedAmount: true,
        ModeOfPayment: true,
        Plot_No: true,
        AgentName: true,
      },
    });

    const jointData = {
      mainForms,
      receipts,
    };

    const jsonSerializer = JSONbig({ storeAsString: true });
    const serializedJointData = jsonSerializer.stringify(jointData);
    res.send(serializedJointData);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
