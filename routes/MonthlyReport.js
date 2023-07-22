const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });

// Month wise Report
router.get('/', async function (req, res, next) {
  try {
   // const { startDate, endDate } = req.body;
    const startDate= "2023-05-17";
    const endDate = "2023-05-20"

    if (!startDate || !endDate) {
      return res.status(400).send('Both start date and end date are required.');
    }

    // Convert the start and end dates to JavaScript Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Month Wise
    const monthWiseReportQuery = await prisma.$queryRaw`
    SELECT [Date], [Total_Received_Amount], [Office_Expence], [Net_Amount]
    FROM [pakdempk].[dbo].[MonthWiseReport]
    WHERE [Date] >= ${startDate} AND [Date] <= ${endDate};
    `;

    //mode of Payment sum data
    const totalReceivedAmountQuery = await prisma.$queryRaw`
    SELECT [ModeOfPayment], SUM([ReceivedAmount]) AS TotalReceivedAmount
    FROM [pakdempk].[dbo].[ReceiptTbl]
    WHERE [Date] >= ${startDate} AND [Date] <= ${endDate}
    GROUP BY [ModeOfPayment];
    `;

    //Administration Expense
    const totalExpenditureQuery = await prisma.$queryRaw`
    SELECT SUM(ET.[Amount]) AS TotalExpenditure
    FROM [pakdempk].[dbo].[ExpenditureTbl] AS ET
    JOIN [pakdempk].[dbo].[ExpenseHeadsTbls] AS EH ON ET.[ExpenseID] = EH.[ExpenseID]
    WHERE EH.[ExpenseSubHead] = 'Administration Expenditures'
        AND ET.[ExpDate] >= ${startDate} AND ET.[ExpDate] <= ${endDate};
    `;

    const CostOfLand = await prisma.$queryRaw`
    SELECT SUM(ET.[Amount]) AS TotalCostOfLand
    FROM [pakdempk].[dbo].[ExpenditureTbl] AS ET
    JOIN [pakdempk].[dbo].[ExpenseHeadsTbls] AS EH ON ET.[ExpenseID] = EH.[ExpenseID]
    WHERE EH.[ExpenseNature] = 'Cost of Land' AND ET.ExpDate >= ${startDate} AND ET.ExpDate <= ${endDate};
    `;

    const SiteDevelopmentCost = await prisma.$queryRaw`
    SELECT SUM(ET.[Amount]) AS SiteDevelopmentCost
    FROM [pakdempk].[dbo].[ExpenditureTbl] AS ET
    JOIN [pakdempk].[dbo].[ExpenseHeadsTbls] AS EH ON ET.[ExpenseID] = EH.[ExpenseID]
    WHERE EH.[ExpenseNature] = 'Development Expense' AND ET.ExpDate >= ${startDate} AND ET.ExpDate <= ${endDate};
    `;

    const result = {

    //Checking null for each

    monthWiseReport: monthWiseReportQuery
                        ? monthWiseReportQuery : 0,

    totalReceivedAmount: totalReceivedAmountQuery
                        ? totalReceivedAmountQuery : 0,

    AdministrationExpense: totalExpenditureQuery[0].TotalExpenditure
                        ? totalExpenditureQuery[0].TotalExpenditure : 0,

    CostOfLand : CostOfLand[0].TotalCostOfLand 
                        ? CostOfLand[0].TotalCostOfLand : 0 ,

    SiteDevelopmentCost : SiteDevelopmentCost[0].SiteDevelopmentCost  
                        ? SiteDevelopmentCost[0].SiteDevelopmentCost  : 0
    };



    const serializedallresult = jsonSerializer.stringify(result);

    res.send(serializedallresult);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;