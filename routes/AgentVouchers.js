var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

const jsonSerializer = JSONbig({ storeAsString: true });

var { isAdmin,protect } = require('../middleware/authMiddleware')

router.get('/all',protect,isAdmin, async function (req, res, next) {
  try {
    const agentVouchers = await prisma.$queryRaw`
      SELECT
        "AgentTbl"."AgentID",
        "AgentTbl"."AgentName",
        "VoucherTbl"."VoucherID",
        "VoucherTbl"."FileNo",
        "VoucherTbl"."VoucherNo",
        "VoucherTbl"."VoucherDate",
        "VoucherTbl"."Amount",
        "VoucherTbl"."Description",
        "VoucherTbl"."CommissionPercentage",
        "VoucherTbl"."CommissionType",
        "VoucherTbl"."BBF"
      FROM "AgentTbl"
      LEFT JOIN "VoucherTbl" ON "AgentTbl"."AgentID" = "VoucherTbl"."Agent"
      WHERE "VoucherTbl"."VoucherID" IS NOT NULL;
    `;

    res.send(agentVouchers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/',protect,isAdmin, async function (req, res, next) {
  try {
    const {agentName} = req.body;
    // will be req.body later on; also, prisma is case sensitive 

    const agentVouchers = await prisma.agentTbl.findFirst({
      where: {
        AgentName: agentName, // Perform a case-insensitive comparison later on if needed
      },
      include: {
        VoucherTbl: true,
      },
    });

    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedAgentVouchers = jsonSerializer.stringify(agentVouchers);

    res.send(serializedAgentVouchers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.get('/details',isAdmin, protect,async function (req, res, next) {
  try {
    const { VoucherID } = req.body;

    const agentVouchers = await prisma.voucherTbl.findFirst({
      where: {
        VoucherID: parseInt(VoucherID), 
      }
    });

    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedAgentVouchers = jsonSerializer.stringify(agentVouchers);

    res.send(serializedAgentVouchers);
  } catch (error) {
    console.error(error);
    next(error);
  }
})


//create agent payment voucher
router.post('/createVoucher',protect, isAdmin,async function (req, res, next) {
  try {
    const {
      FileNo,
      VoucherDate,
      Agent,
      Amount,
      Description,
      CommissionPercentage,
      CommissionType,
      BBF,
      VoucherNo,
    } = req.body;

    const newVoucher = await prisma.voucherTbl.create({
      data: {
        FileNo,
        VoucherDate : new Date(VoucherDate),
        Agent,
        Amount,
        Description,
        CommissionPercentage,
        CommissionType,
        BBF,
        VoucherNo,
      },
    });

    console.log(newVoucher);
    const serializedNewVoucher = jsonSerializer.stringify(newVoucher);

    res.status(200).json(serializedNewVoucher);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/update', async function (req, res, next) {
  try {
    const {
      VoucherID,
      FileNo,
      VoucherDate,
      Agent,
      Amount,
      Description,
      CommissionPercentage,
      CommissionType,
      BBF,
      VoucherNo,
    } = req.body;

    const data = {
      FileNo,
      VoucherDate : new Date(VoucherDate),
      Agent,
      Amount,
      Description,
      CommissionPercentage,
      CommissionType,
      BBF,
      VoucherNo,
    };

    console.log(data);

    // Now you can use 'data' to create a new VoucherTbl record in the database.
    // For example, using Prisma:
    const updatedVoucher = await prisma.voucherTbl.update({
      where:{
        VoucherID : parseInt(VoucherID),
      },
      data: data,
    });

    console.log(updatedVoucher);
    const serializedupdatedVoucher = jsonSerializer.stringify(updatedVoucher);

    res.status(200).json(serializedupdatedVoucher);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Delete 
router.delete('/delete',protect, isAdmin,async function (req, res, next) {
  try {

    const  { VoucherID  } = req.body

    const allVouchers = await prisma.voucherTbl.delete({
      where:{
        VoucherID : parseInt(VoucherID),
      }
    });
    res.status(200).json({
      success: true,
      message: `Voucher with VoucherID ${VoucherID} has been deleted successfully.`
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
