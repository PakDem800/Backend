const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });
var {isAdmin,protect } = require('../middleware/authMiddleware')

router.get('/',protect, isAdmin,async function (req, res, next) {
  try {
    const { plotSize, plotBlock, applicantName, agent } = req.body;
        
        const mainForms = await prisma.MainAppForm.findMany({
          where: {
            Area: plotSize,
            Block: plotBlock,
            ...(applicantName ? { ApplicantName: applicantName } : {}),
            ...(agent ? { Agent: agent } : {}),
          },
          select: {
            Date: true,
            FileNo: true,
            FileType: true,
            PlotNo: true,
            Phase: true,
            Block: true,
            PlotLocation: true,
            ApplicantName: true,
            TotalAmount: true,
            Agent: true,
            PlotCategory: true,
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
