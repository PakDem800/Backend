const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

router.get('/', async function (req, res, next) {
  try {
   // const { PlotNo, FileNo, ApplicantName, CNICNo } = req.body;
    const applicantName = null
    const CNICNo = null
    const PlotNo = null
    const FileNo = null
    

    //req.body will be used
    
    
        
        const mainForms = await prisma.MainAppForm.findMany({
          where: {
            ...(CNICNo ? { CNICNo: CNICNo } : {}),
            ...(FileNo ? { FileNo: FileNo } : {}),
            ...(applicantName ? { ApplicantName: applicantName } : {}),
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
