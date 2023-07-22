const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
var { protect } = require('../middleware/authMiddleware')
const jsonSerializer = JSONbig({ storeAsString: true });

// Ledger Report
router.get('/LedgerReport',protect, async function (req, res, next) {
    try {
        const allreceipt = await prisma.receiptTbl.findMany();
        const serializedallreceipt = jsonSerializer.stringify(allreceipt);
    
        res.send(serializedallreceipt);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});



module.exports = router;