var express = require('express');
var router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });
var { isAdmin,protect } = require('../middleware/authMiddleware')

router.get('/',protect, async function (req, res, next) {
  try {
    const {userEnteredFileNo} = req.body; 
   
    const paymentSchedule = await prisma.paymentSchedule.findFirst({
      where: {
        FileNo: userEnteredFileNo,
      },
      select: {
        PaymentScheduleID: true,
        FileNo: true,
        DueDate: true,
        MonthIyInstallement: true,
        MainAppForm: {
          select: {
            ApplicantName: true,
            Date: true,
          },
        },
      },
    });



    // Serialize the BigInt values using json-bigint
    const jsonSerializer = JSONbig({ storeAsString: true });
    const serializedpaymentSchedule = jsonSerializer.stringify(paymentSchedule);

    res.send(serializedpaymentSchedule);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
