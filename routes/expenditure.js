const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });

// expenditure Report
router.get('/expenditure', async function (req, res, next) {
    try {
        const allreceipt = await prisma.expenditureTbl.findMany({
          select: {
            ExpenseHeadsTbls:  {
              select: {
                ExpenseID: true, // Include ExpenseID
                ExpenseSubHead: true,
                ExpenseNature: true,
              },
            },
            ExpenditureID: true, // Include ExpenditureID
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



module.exports = router;
