const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });

// regular receipt
router.get('/RegularReceipt', async function (req, res, next) {
  try {
    const allMainForm = await prisma.receiptTbl.findMany();
    const serializedMainAppForm = jsonSerializer.stringify(allMainForm);

    res.send(serializedMainAppForm);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
//transfer receipt
router.get('/transferReceipt', async function(req,res,next){
    try {
        const allMainForm = await prisma.refundTbl.findMany();
        const serializedMainAppForm = jsonSerializer.stringify(allMainForm);
    
        res.send(serializedMainAppForm);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});

// developmnt charges
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
