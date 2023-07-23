const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

const jsonSerializer = JSONbig({ storeAsString: true });
var { protect } = require('../middleware/authMiddleware')
router.get('/', protect,async function (req, res, next) {
  try {
   const { PlotNo, FileNo, ApplicantName, CNICNo } = req.body;

        const mainForms = await prisma.MainAppForm.findMany({
          where: {
            ...(CNICNo ? { CNICNo: CNICNo } : {}),
            ...(FileNo ? { FileNo: FileNo } : {}),
            ...(ApplicantName ? { ApplicantName: ApplicantName } : {}),
            ...(PlotNo ? { PlotNo: PlotNo } : {}),
          },
          select: {
            Date: true,
            FileNo: true,
            FileType: true,
            PlotNo: true,
            ContactNo : true,
            ApplicantName: true,
            Agent: true,
          },
        });
  
        
      
  

    const jsonSerializer = JSONbig({ storeAsString: true });
    const serializedMainForms = jsonSerializer.stringify(mainForms);
    res.send(serializedMainForms);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
