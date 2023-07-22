const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const prisma = new PrismaClient();
var { ExpenditureAuthorization , protect } = require('../middleware/authMiddleware')

const jsonSerializer = JSONbig({ storeAsString: true });

// expenditure Report with date range filter
router.get('/',protect,ExpenditureAuthorization, async function (req, res, next) {
  try {
    const startDate = '2022-04-19'; // User enters the start date in format 'YYYY-MM-DD' (e.g., '2023-05-02')
    const endDate = '2022-04-19'; // User enters the end date in format 'YYYY-MM-DD' (e.g., '2023-05-05')

    if (!startDate || !endDate) {
      return res.status(400).send('Both start date and end date are required.');
    }

    // Convert the start and end dates to JavaScript Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Prisma query to retrieve expenditure records within the specified date range
    const allreceipt = await prisma.expenditureTbl.findMany({
      where: {
        ExpDate: {
          gte: startDateObj, // 'gte' means greater than or equal to the start date
          lte: endDateObj,   // 'lte' means less than or equal to the end date
        },
      },
      select: {
        ExpenseHeadsTbls: {
          select: {
            ExpenseID: true,
            ExpenseSubHead: true,
            ExpenseNature: true,
          },
        },
        ExpenditureID: true,
        ExpDate: true,
        Amount: true,
        Remarks: true,
        ExpenditureNature: true,
        PVNo: true,
        ModeOfPayment: true,
        ToPayee: true,
      },
    });

    const serializedallreceipt = jsonSerializer.stringify(allreceipt);

    res.send(serializedallreceipt);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//Create Expenditure
router.post('/createExpenditure',protect,ExpenditureAuthorization, async function (req, res, next) {
  try {
    const {
      ExpenseMainHead,
      ExpenseSubHead,
      ExpenseNature,
      ExpDate,
      Amount,
      Remarks,
      ExpenditureNature,
      PVNo,
      ModeOfPayment,
      ToPayee,
      PayeeCNICNo,
      MobileNo,
    } = req.body;

    // First, create the ExpenseHeadsTbls record
    const newExpenseHead = await prisma.expenseHeadsTbls.create({
      data: {
        ExpenseMainHead,
        ExpenseSubHead,
        ExpenseNature,
      },
    });

    // Get the ID of the newly created expense head
    const ExpenseID = newExpenseHead.ExpenseID;

    // Now, create the ExpenditureTbl record with the ExpenseID
    const newExpenditure = await prisma.expenditureTbl.create({
      data: {
        ExpDate : new Date(ExpDate),
        Amount,
        Remarks,
        ExpenditureNature,
        PVNo,
        ModeOfPayment,
        ToPayee,
        PayeeCNICNo,
        MobileNo,
        ExpenseID,
      },
    });

    console.log(newExpenditure);
    const serializednewExpenditure = jsonSerializer.stringify(newExpenditure);

    res.status(200).json(serializednewExpenditure);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//Get 1 expenditure record
router.get('/details',protect,ExpenditureAuthorization, async function (req, res, next) {
  try {
    
    const {ExpenditureID} = req.body

    // Prisma query to retrieve expenditure records within the specified date range
    const receipt = await prisma.expenditureTbl.findFirst({
      where: {
        ExpenditureID:  parseInt(ExpenditureID),
      },
      select: {
        ExpenseHeadsTbls: {
          select: {
            ExpenseID: true,
            ExpenseSubHead: true,
            ExpenseNature: true,
            ExpenseMainHead : true
          },
        },
        ExpenditureID: true,
        ExpDate: true,
        Amount: true,
        Remarks: true,
        ExpenditureNature: true,
        PVNo: true,
        ModeOfPayment: true,
        ToPayee: true,
      },
    });

    const serializedallreceipt = jsonSerializer.stringify(receipt);

    res.send(serializedallreceipt);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//Update expenditure
router.put('/update',protect, async function (req, res, next) {
    try {
      const {
        ExpenseID,
        ExpenditureID,
        ExpenseMainHead,
        ExpenseSubHead,
        ExpenseNature,
        ExpDate,
        Amount,
        Remarks,
        ExpenditureNature,
        PVNo,
        ModeOfPayment,
        ToPayee,
        PayeeCNICNo,
        MobileNo,
        
      } = req.body;
  
      // Check if both ExpenseID and ExpenditureID are provided
      if (!ExpenseID || !ExpenditureID) {
        return res.status(400).json({
          success: false,
          message: 'Both ExpenseID and ExpenditureID are required in the request body.',
        });
      }
  
      // Update the ExpenditureTbl record with the provided data
      const updatedExpenditure = await prisma.expenditureTbl.update({
        where: {
          ExpenditureID: parseInt(ExpenditureID),
        },
        data: {
          ExpDate: new Date(ExpDate),
          Amount,
          Remarks,
          ExpenditureNature,
          PVNo,
          ModeOfPayment,
          ToPayee,
          PayeeCNICNo,
          MobileNo,
          ExpenseID: parseInt(ExpenseID)
        },
      });
  
      
      
      const updatedExpenseHead = await prisma.expenseHeadsTbls.update({
        where: {
          ExpenseID: parseInt(ExpenseID),
        },
        data: {
          ExpenseMainHead,
          ExpenseSubHead,
          ExpenseNature,
        },
      });

      console.log(updatedExpenditure);
      const serializedUpdatedExpenditure = jsonSerializer.stringify(updatedExpenditure);

      res.status(200).json(serializedUpdatedExpenditure);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  


module.exports = router;
