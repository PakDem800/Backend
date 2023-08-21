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
        ApplicationNo : item.ApplicationNo,
        Date:item.Date.toISOString().split('T')[0],
        File_No : item.FileNo,
        Area : item.Area,
        Plot_No : item.PlotNo,
        Applicant_Name : item.ApplicantName,
        Contact_No : item.ContactNo,
        Total_Amount : item.TotalAmount,
        Down_Payment : item.DownPayment
      
    }));
    const serializedMainAppForm = jsonSerializer.stringify(MainAppForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/Cashmainform', protect, async function (req, res, next) {
  try {
    const allMainForm = await prisma.mainAppForm.findMany({
      where: {
        ModeOfPayment: 'cash'
      },
      select: {
        ApplicationNo: true,
        Date: true,
        FileNo: true,
        Area: true,
        PlotNo: true,
        ApplicantName: true,
        ContactNo: true,
        TotalAmount: true,
        DownPayment: true
      }
    });

    const MainAppForm = allMainForm.map(item => ({
      ApplicationNo: item.ApplicationNo,
      Date: item.Date.toISOString().split('T')[0],
      File_No: item.FileNo,
      Area: item.Area,
      Plot_No: item.PlotNo,
      Applicant_Name: item.ApplicantName,
      Contact_No: item.ContactNo,
      Total_Amount: item.TotalAmount,
      Down_Payment: item.DownPayment
    }));

    const serializedMainAppForm = jsonSerializer.stringify(MainAppForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/installmentFiles', protect, async function (req, res, next) {
  try {
    const allMainForm = await prisma.mainAppForm.findMany({
      where: {
        OR: [
          { ModeOfPayment: 'installment' },
          { ModeOfPayment: 'installments' }
        ]
      },
      select: {
        ApplicationNo: true,
        Date: true,
        FileNo: true,
        Area: true,
        PlotNo: true,
        ApplicantName: true,
        ContactNo: true,
        TotalAmount: true,
        DownPayment: true
      }
    });

    const receiptData = await prisma.receiptTbl.findMany({
      where: {
        ReceiptNo: {
          in: allMainForm.map(item => item.ApplicationNo)
        }
      },
      select: {
        ReceiptNo: true,
        ReceivedAmount: true
      }
    });

    const receiptSumMap = receiptData.reduce((acc, curr) => {
      acc[curr.ReceiptNo] = BigInt(acc[curr.ReceiptNo] || 0) + BigInt(curr.ReceivedAmount || 0);
      return acc;
    }, {});

    const MainAppFormWithShortfall = allMainForm.map(item => ({
      ApplicationNo: item.ApplicationNo,
      Date: item.Date.toISOString().split('T')[0],
      File_No: item.FileNo,
      Plot_No: item.PlotNo,
      Applicant_Name: item.ApplicantName,
      Contact_No: item.ContactNo,
      Total_Amount: item.TotalAmount,
      Down_Payment: item.DownPayment,
      shortFall: BigInt(item.TotalAmount) - BigInt(item.DownPayment) - (receiptSumMap[item.ApplicationNo] || 0n)
    }));

    const serializedMainAppForm = jsonSerializer.stringify(MainAppFormWithShortfall);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});





router.get('/mainform/Files',protect, async function (req, res, next) {
  try {
    const allMainForm = await prisma.mainAppForm.findMany({
      select : {
        ApplicationNo : true,
        
        FileNo : true,
        
      }
    });

    const MainAppForm = allMainForm.map(item => ({
        ApplicationNo : item.ApplicationNo,
        FileNo : item.FileNo,
      
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
      UserID,
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
      
    } = req.body;
    
    
    const data = {
      Date : date ? new Date(date) : new Date()  ,
      FileNo,
      FileType,
      Area,
      PlotNo,
      PlotID : parseInt(PlotID),
      Phase,
      Block,
      Total_Installment : parseInt(Total_Installment),
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
      InvestorAmount : parseInt(InvestorAmount),
      InvestorDownPayment : parseInt(InvestorDownPayment),
      TotalAmount : parseInt(TotalAmount),
      DownPayment : parseInt(DownPayment),
      MonthlyInstallment : parseInt(MonthlyInstallment),
      InvestorMonthlyInstallment : parseInt(InvestorMonthlyInstallment),
      CornerCharges : parseInt(CornerCharges),
      GrandTotal : parseInt(GrandTotal),
      AppRemarks,
      RefMobileNo,
      Agent  : parseInt(Agent),
      CommissionPercentage: parseInt(CommissionPercentage),
      NoteNo,
      IsActive,
      IsPlotCancel,
      IsCurrentWith,
      PlotCategory,
      Discount : parseInt(Discount),
      PossesionStatus,
      SubAgent :parseInt(SubAgent),
      SubAgentComm :parseInt(SubAgentComm),
      Investor :parseInt(Investor),
      Prepaired_By :parseInt(Prepaired_By),
      Prepaired_by_Name,
      TransferAmount :parseInt(TransferAmount),
      TransferDate : TransferDate ? new Date(TransferDate) : null,
      DevelopmentChargesIncluded,
      DevelopmentAmount :parseInt(DevelopmentAmount),
      DevelopmentChargesDate : DevelopmentChargesDate ? new Date(DevelopmentChargesDate) : null ,
      UpdatedBy :parseInt(UpdatedBy),
      RefundedStatus,
      RefundDate : RefundDate ? new Date(RefundDate) : null,
      DeductedAmount :parseInt(DeductedAmount),
      InstallmentsForRefund :parseInt(InstallmentsForRefund),
      RefundAmount:parseInt(RefundAmount)
    };
    
    // Now you can use 'data' to create a new MainAppForm record in the database.
    // For example, using Prisma:
    const newMainAppForm = await prisma.mainAppForm.create({
      data: data,
    });
    

    if(DevelopmentChargesIncluded) {
      const newReceipt = await prisma.receiptTbl.create({
        data: {
          ReceiptNo: newMainAppForm.ApplicationNo,
          FileNo: newMainAppForm.FileNo,
          Date: DevelopmentChargesDate ? new Date(DevelopmentChargesDate) : new Date(), 
          ReceivedAmount: parseInt(DevelopmentAmount),
          ReceivedFrom: ApplicantName,
          AmountReceivedForPlot: PlotNo ? PlotNo : 'not entered',
          ModeOfPayment: ModeOfPayment ? ModeOfPayment : 'Cash',
          Receipt: newMainAppForm.ApplicationNo,
          Prepaired_By: Prepaired_By ? parseInt(Prepaired_By) : 0,
          Prepaired_by_Name: Prepaired_by_Name ? Prepaired_by_Name : "not mentioned",
          ReceiptType: 3,
        },
      });
      
     
    }

    const userActivity = await prisma.testtable.create({
      data:{
        ApplicationNo : newMainAppForm.ApplicationNo,
        Applicant_Name : 'Created',
        Agent : UserID , 
        Date : new Date(),
        Receivied_Amount : 0,
        Mode_Of_Payment : 'no',
        Receipt : newMainAppForm.ApplicationNo,
        File_No : newMainAppForm.FileNo
      }
    })
    
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

   

    // Find the latest date for the FileNo in the ReceiptTbl
    const latestReceiptDate = await prisma.receiptTbl.findFirst({
      where: {
        ReceiptNo: parseInt(ApplicationNo),
        ReceivedAmount: {
          gt: 0, 
        },
      },
      orderBy: {
        Date: 'desc', 
      },
    });

    mainAppForm.Date = mainAppForm.Date?.toISOString().split('T')[0]
    mainAppForm.DevelopmentChargesDate = mainAppForm.DevelopmentChargesDate?.toISOString().split('T')[0]
    mainAppForm.TransferDate = mainAppForm.TransferDate?.toISOString().split('T')[0]
    mainAppForm.RefundDate = mainAppForm.RefundDate?.toISOString().split('T')[0]

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
        if(monthDifference > 1 )
          {
            status = 'active';
            reason = `installment pending from ${monthDifference} months`;
          }
          else{
            status = 'active';
            reason = ``;
          }
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
    
    // Send the combined data as the response
    res.send(serializedResponseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.put('/mainform/update' ,protect,isAdmin,async function (req, res, next) {
  try {

    
    // Get the form data from the request body
    const {
      UserID,
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
      
    } = req.body;

  
    const updatedData = {
      Date : date ? new Date(date) : new Date() ,
      FileNo,
      FileType,
      Area,
      PlotNo,
      PlotID : parseInt(PlotID),
      Phase,
      Block,
      Total_Installment : parseInt(Total_Installment),
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
      InvestorAmount : parseInt(InvestorAmount),
      InvestorDownPayment : parseInt(InvestorDownPayment),
      TotalAmount : parseInt(TotalAmount),
      DownPayment : parseInt(DownPayment),
      MonthlyInstallment : parseInt(MonthlyInstallment),
      InvestorMonthlyInstallment : parseInt(InvestorMonthlyInstallment),
      CornerCharges : parseInt(CornerCharges),
      GrandTotal : parseInt(GrandTotal),
      AppRemarks,
      RefMobileNo,
      Agent  : parseInt(Agent),
      CommissionPercentage: parseInt(CommissionPercentage),
      NoteNo,
      IsActive,
      IsPlotCancel,
      IsCurrentWith,
      PlotCategory,
      Discount : parseInt(Discount),
      PossesionStatus,
      SubAgent :parseInt(SubAgent),
      SubAgentComm :parseInt(SubAgentComm),
      Investor :parseInt(Investor),
      Prepaired_By :parseInt(Prepaired_By),
      Prepaired_by_Name,
      TransferAmount :parseInt(TransferAmount),
      TransferDate : TransferDate ? new Date(TransferDate) : null,
      DevelopmentChargesIncluded,
      DevelopmentAmount :parseInt(DevelopmentAmount),
      DevelopmentChargesDate : DevelopmentChargesDate ? new Date(DevelopmentChargesDate) : null ,
      UpdatedBy :parseInt(UpdatedBy),
      RefundedStatus,
      RefundDate : RefundDate ? new Date(RefundDate) : null,
      DeductedAmount :parseInt(DeductedAmount),
      InstallmentsForRefund :parseInt(InstallmentsForRefund),
      RefundAmount:parseInt(RefundAmount)
    };


    const updatedForm = await prisma.mainAppForm.update({
      where: {
        ApplicationNo,
      },
      data: updatedData,
    });

    const userActivity = await prisma.testtable.create({
      data:{
        ApplicationNo : updatedForm.ApplicationNo,
        Applicant_Name : 'Updated',
        Agent : UserID , 
        Date : new Date(),
        Receivied_Amount : 0,
        Mode_Of_Payment : 'no',
        Receipt : updatedForm.ApplicationNo,
        File_No : updatedForm.FileNo
      }
    })


    // Convert the response data to a JSON string
    const serializedResponseData = jsonSerializer.stringify(updatedForm);

    

    return res
    .status(200)
    .json(serializedResponseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error While Updating' });
  }
});

//Delete
router.delete('/mainform/delete',protect,isAdmin , async function (req, res, next) {
  try {
    const { UserID , applicationNo } = req.query;

    console.log(applicationNo)
    
    if (!applicationNo) {
      return res.status(400).json({
        success: false,
        message: 'ApplicationNo is required in the request body.',
      });
    }

    const ApplicationNo = parseInt(applicationNo);


    const mainAppForm = await prisma.mainAppForm.findFirst({
      where: {
        ApplicationNo: parseInt(ApplicationNo),
      },
    });

    // Use Prisma client to delete the record
    const deletedRecord = await prisma.mainAppForm.delete({
      where: {
        ApplicationNo: ApplicationNo,
      },
    });

    const userActivity = await prisma.testtable.create({
      data:{
        ApplicationNo : mainAppForm.ApplicationNo,
        Applicant_Name : 'Deleted',
        Agent : UserID , 
        Date : new Date(),
        Receivied_Amount : 0,
        Mode_Of_Payment : 'no',
        Receipt : mainAppForm.ApplicationNo,
        File_No : mainAppForm.FileNo ?  mainAppForm.FileNo : "not mentioned"
      }
    })

    res.status(200).json({
      success: true,
      message: `Application Form is deleted successfully.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

/*              Transfer Amunt Router                       */

router.put('/TransferFile' ,protect,async function (req, res, next) {
  try {

    
    // Get the form data from the request body
    const {
      applicationNo,
      ApplicantName,
      FatherOrHusband,
      CNICNo,
      ContactNo,
      Nok,
      NokSRelation,
      TransferAmount,
      TransferDate,
    
      
    } = req.body;

  
    const updatedData = {
      ApplicantName,
      FatherOrHusband,
      CNICNo ,
      ContactNo,
      Nok,
      NokSRelation,
      TransferAmount : parseInt(TransferAmount),
      TransferDate : TransferDate ? new Date(TransferDate) : new Date(),
    };


    const updatedForm = await prisma.mainAppForm.update({
      where: {
        ApplicationNo : parseInt(applicationNo),
      },
      data: updatedData,
    });

   return res.status(201).json("Successfully Created Transfered File");

    // // Convert the response data to a JSON string
    // const serializedResponseData = jsonSerializer.stringify(updatedForm);

    

    // return res
    // .status(200)
    // .json(serializedResponseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error While Updating' });
  }
});

router.get('/TransferFile',protect, async function (req, res, next) {
  try {
    const allMainForm = await prisma.mainAppForm.findMany({
      where: {
        TransferAmount: {
          not: null
        } },
      select : {
        ApplicationNo : true,
        Date:true,
        FileNo : true,
        Area : true,
        PlotNo : true,
        ApplicantName : true,
        ContactNo : true,
        TotalAmount : true,
        TransferDate : true
        
      }
    });

    const MainAppForm = allMainForm.map(item => ({
        ApplicationNo : item.ApplicationNo,
        Date:item.Date.toISOString().split('T')[0],
        File_No : item.FileNo,
        Area : item.Area,
        Plot_No : item.PlotNo,
        Applicant_Name : item.ApplicantName,
        Contact_No : item.ContactNo,
        Total_Amount : item.TotalAmount,
        Transfer_Date : item.TransferDate?.toISOString().split('T')[0]
      
    }));
    const serializedMainAppForm = jsonSerializer.stringify(MainAppForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/transfer/details', protect, async function (req, res, next) {
  try {
    const { FileNo } = req.query;

    // Find the mainAppForm with the provided ApplicationNo in the database
    const mainAppForm = await prisma.mainAppForm.findFirst({
      where: {
        FileNo: FileNo,
      },
    });

    // If form not found, return error
    if (!mainAppForm) {
      return res.status(404).json({ error: 'Form not found' });
    }


   mainAppForm.Date =  mainAppForm.Date?.toISOString().split('T')[0]
   mainAppForm.DevelopmentChargesDate =  mainAppForm.DevelopmentChargesDate?.toISOString().split('T')[0]
   mainAppForm.TransferDate =  mainAppForm.TransferDate?.toISOString().split('T')[0]

    

    // Convert the response data to a JSON string
    const serializedResponseData = jsonSerializer.stringify(mainAppForm);
    
    // Send the combined data as the response
    res.send(serializedResponseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
      ApplicationNo : parseInt(ApplicationNo),
      RefundDate : RefundDate ? new Date(RefundDate) : new Date(),
      RefundAmount : parseInt(RefundAmount),
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
