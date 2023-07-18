const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const JSONbig = require('json-bigint');
const app = express();

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });
// Parse JSON data sent in the request body
app.use(bodyParser.json());

// main form
router.get('/mainform', async function (req, res, next) {
  try {
    const allMainForm = await prisma.mainAppForm.findMany();
    const serializedMainAppForm = jsonSerializer.stringify(allMainForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Main form Creation
router.post('/CreatemainForm' ,async function (req, res, next) {
  try {
    
    const {
      Date,
      FileNo,
      FileType,
      Area,
      PlotNo,
      PlotID,
      Phase,
      Block,
      Total_Installment,
      PlotLocation,
      ApplicantName,
      FatherOrHusband,
      CNICNo,
      ContactNo,
      PermanentAddress,
      PostalAddress,
      Nok,
      NoKFatherName,
      NokSRelation,
      NoKAddress,
      Refrence,
      ModeOfPayment,
      InvestorAmount,
      InvestorDownPayment,
      TotalAmount,
      DownPayment,
      MonthlyInstallment,
      InvestorMonthlyInstallment,
      CornerCharges,
      GrandTotal,
      AppRemarks,
      RefMobileNo,
      Agent,
      CommissionPercentage,
      NoteNo,
      IsActive,
      IsPlotCancel,
      IsCurrentWith,
      PlotCategory,
      Discount,
      PossesionStatus,
      SubAgent,
      SubAgentComm,
      Investor,
      Prepaired_By,
      Prepaired_by_Name,
      TransferAmount,
      TransferDate,
      DevelopmentChargesIncluded,
      DevelopmentAmount,
      DevelopmentChargesDate,
      UpdatedBy,
      RefundedStatus,
      RefundDate,
      DeductedAmount,
      InstallmentsForRefund,
      RefundAmount,
      // Add other fields from req.body here
    } = req.body;
    
    
    const data = {
      Date ,
      FileNo,
      FileType,
      Area,
      PlotNo,
      PlotID,
      Phase,
      Block,
      Total_Installment,
      PlotLocation,
      ApplicantName,
      FatherOrHusband,
      CNICNo,
      ContactNo,
      PermanentAddress,
      PostalAddress,
      Nok,
      NoKFatherName,
      NokSRelation,
      NoKAddress,
      Refrence,
      ModeOfPayment,
      InvestorAmount,
      InvestorDownPayment,
      TotalAmount,
      DownPayment,
      MonthlyInstallment,
      InvestorMonthlyInstallment,
      CornerCharges,
      GrandTotal,
      AppRemarks,
      RefMobileNo,
      Agent,
      CommissionPercentage,
      NoteNo,
      IsActive,
      IsPlotCancel,
      IsCurrentWith,
      PlotCategory,
      Discount,
      PossesionStatus,
      SubAgent,
      SubAgentComm,
      Investor,
      Prepaired_By,
      Prepaired_by_Name,
      TransferAmount,
      TransferDate,
      DevelopmentChargesIncluded,
      DevelopmentAmount,
      DevelopmentChargesDate,
      UpdatedBy,
      RefundedStatus,
      RefundDate,
      DeductedAmount,
      InstallmentsForRefund,
      RefundAmount,
      // Add other fields from req.body here
    };
    
    // Now you can use 'data' to create a new MainAppForm record in the database.
    // For example, using Prisma:
    const newMainAppForm = await prisma.mainAppForm.create({
      data: data,
    });
    console.log(newMainAppForm)
    const serializedMainAppForm = jsonSerializer.stringify(newMainAppForm);

    res.status(200).json(serializedMainAppForm);    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
} )

//refund schedule
router.get('/refundSchedule', async function(req,res,next){
    try {
        const allMainForm = await prisma.refundTbl.findMany();
        const serializedMainAppForm = jsonSerializer.stringify(allMainForm);
    
        res.send(serializedMainAppForm);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});

//create refund
router.post('/createRefund', async function (req, res, next) {
  try {
    const {
      ApplicationNo,
      RefundDate,
      RefundAmount,
      Installment,
      ModeofPayment,
      Remarks,
    } = req.body;

    const data = {
      ApplicationNo,
      RefundDate ,
      RefundAmount 
       ,
      Installment ,
      ModeofPayment,
      Remarks ,
    };

    console.log(data);

    // Now you can use 'data' to create a new RefundTbl record in the database.
    // For example, using Prisma:
    const newRefund = await prisma.refundTbl.create({
      data: data,
    });
    console.log(newRefund);
    const serializednewRefund = jsonSerializer.stringify(newRefund);

    res.status(200).json(serializednewRefund);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//files developmnt charges
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


module.exports = router;
