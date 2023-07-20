const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });

// expenditure Report with date range filter
router.get('/', async function (req, res, next) {
  try {
    const startDate = '2021-02-26'; // User enters the start date in format 'YYYY-MM-DD' (e.g., '2023-05-02')
    const endDate = '2021-03-04'; // User enters the end date in format 'YYYY-MM-DD' (e.g., '2023-05-05')

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
router.post('/createExpenditure', async function (req, res, next) {
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


module.exports = router;
