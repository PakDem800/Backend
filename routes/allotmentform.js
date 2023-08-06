const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const JSONbig = require('json-bigint');
const app = express();

const prisma = new PrismaClient();

const jsonSerializer = JSONbig({ storeAsString: true });

var { isAdmin , protect } = require('../middleware/authMiddleware')

// Parse JSON data sent in the request body
app.use(bodyParser.json());

// main form
router.get('/mainform',protect, async function (req, res, next) {
  try {
    const allMainForm = await prisma.mainAppForm.findMany({
      select : {
        ApplicationNo : true,
        Date:true,
        FileNo : true,
        Area : true,
        PlotNo : true,
        ApplicantName : true,
        ContactNo : true,
        TotalAmount : true,
        DownPayment : true
        
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

//Main form Creation
router.post('/CreatemainForm' ,protect,async function (req, res, next) {
  try {
    
    const {
      date,
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
      Date : new Date(date) ,
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
      TransferDate : new Date(TransferDate),
      DevelopmentChargesIncluded,
      DevelopmentAmount,
      DevelopmentChargesDate : new Date(DevelopmentChargesDate),
      UpdatedBy,
      RefundedStatus,
      RefundDate : new Date(RefundDate),
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
    res.status(500).send(error);
  }
} )

//Get detail of one form
router.get('/mainform/details', protect, async function (req, res, next) {
  try {
    const { ApplicationNo } = req.query;

    // Find the mainAppForm with the provided ApplicationNo in the database
    const mainAppForm = await prisma.mainAppForm.findFirst({
      where: {
        ApplicationNo: parseInt(ApplicationNo),
      },
    });

    // If form not found, return error
    if (!mainAppForm) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Get the FileNo from the mainAppForm
    const fileNo = mainAppForm.FileNo;

    // Find the latest date for the FileNo in the ReceiptTbl
    const latestReceiptDate = await prisma.receiptTbl.findFirst({
      where: {
        FileNo: fileNo,
      },
      orderBy: {
        Date: 'desc', // Get the latest date
      },
    });

    mainAppForm.Date = mainAppForm.Date.toISOString().split('T')[0]
    
    // Calculate the difference in months between the latest receipt date and today's date
    const today = new Date();
    const latestDate = latestReceiptDate ? new Date(latestReceiptDate.Date) : null;

    let statusData = {};

    if (!latestDate) {
      statusData = { status: 'active' };
    } else {
      const monthDifference = (today.getFullYear() - latestDate.getFullYear()) * 12 +
        (today.getMonth() - latestDate.getMonth());

      let status;
      let reason = '';

      if (monthDifference < 3) {
        status = 'active';
        reason = `installment pending from ${monthDifference} months`;
      } else if (monthDifference < 6) {
        status = 'inactive';
        reason = `Due to installment pending from ${monthDifference} months`;
      } else {
        status = 'cancelled';
        reason = `Due to installment pending from ${monthDifference} months`;
      }

      statusData = { status, reason };
    }

    // Combine status and reason inside mainAppForm object
    const responseData = { ...mainAppForm, ...statusData };

    // Convert the response data to a JSON string
    const serializedResponseData = jsonSerializer.stringify(responseData);
    console.log(serializedResponseData)
    // Send the combined data as the response
    res.send(serializedResponseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.put('/mainform/update',protect,isAdmin ,async function (req, res, next) {
  try {

    // Get the form data from the request body
    const {
      ApplicationNo,
      date,
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

    // Prepare the updated data object
    const updatedData = {
      Date : new Date(date) ,
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
      TransferDate : new Date(TransferDate),
      DevelopmentChargesIncluded,
      DevelopmentAmount,
      DevelopmentChargesDate : new Date(DevelopmentChargesDate),
      UpdatedBy,
      RefundedStatus,
      RefundDate : new Date(RefundDate),
      DeductedAmount,
      InstallmentsForRefund,
      RefundAmount,
      // Add other fields from req.body here
    };

    // Update the mainAppForm in the database with the new data
    const updatedForm = await prisma.mainAppForm.update({
      where: {
        ApplicationNo,
      },
      data: updatedData,
    });

    const serializedUpdatedForm = jsonSerializer.stringify(updatedForm);

    res.send(serializedUpdatedForm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Delete
router.delete('/mainform/delete',protect,isAdmin , async function (req, res, next) {
  try {
    const { applicationNo } = req.body;

    if (!applicationNo) {
      return res.status(400).json({
        success: false,
        message: 'ApplicationNo is required in the request body.',
      });
    }

    const ApplicationNo = parseInt(applicationNo);

    console.log(typeof(ApplicationNo));

    // Use Prisma client to delete the record
    const deletedRecord = await prisma.mainAppForm.delete({
      where: {
        ApplicationNo: ApplicationNo,
      },
    });

    res.status(200).json({
      success: true,
      message: `Record with ApplicationNo ${applicationNo} has been deleted successfully.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});







/*                               Refund Router                              */

//refund schedule
router.get('/refundSchedule',protect, async function(req,res,next){
    try {
        const allMainForm = await prisma.refundTbl.findMany();

        const refund = allMainForm.map((item)=>{
          return{
            ...item,
            RefundDate : item.RefundDate.toISOString().split('T')[0]
          }
        })
        const serializedMainAppForm = jsonSerializer.stringify(refund);
    
        res.send(serializedMainAppForm);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});



//create refund
router.post('/createRefund',protect, async function (req, res, next) {
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




module.exports = router;
