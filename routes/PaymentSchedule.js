var express = require('express');
var router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });
var { isAdmin,protect } = require('../middleware/authMiddleware')

router.get('/', protect, async function (req, res, next) {
  try {
    const { userEnteredFileNo } = req.query;

    const paymentSchedule = await prisma.paymentSchedule.findMany({
      where: {
        FileNo: parseInt(userEnteredFileNo),
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

    const payments = paymentSchedule.map(item => ({
      PaymentScheduleID: item.PaymentScheduleID,
      File_No: item.FileNo,
      Applicant_Name: item.MainAppForm.ApplicantName,
      Date: item.DueDate.toISOString().split('T')[0],
      MonthIy_Installement: item.MonthIyInstallement,
      
      
    }));

    

    // Serialize the BigInt values using json-bigint
    const jsonSerializer = JSONbig({ storeAsString: true });
    const serializedpaymentSchedule = jsonSerializer.stringify(payments);

    res.send(serializedpaymentSchedule);
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
