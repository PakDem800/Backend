const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

const jsonSerializer = JSONbig({ storeAsString: true });

var { protect , isAdmin} = require('../middleware/authMiddleware')

router.get('/',protect,isAdmin, async function (req, res, next) {
  try {
    const {agentName} = req.query;

  

    const mainForms = await prisma.$queryRaw`
      SELECT
        main.ApplicationNo,
        main.FileNo as File_No,
        main.ApplicantName as Applicant_Name,
        main.TotalAmount as Total_Amount,
        main.CommissionPercentage as Commission_Percentage,
        (main.TotalAmount * (CAST(agent.CommissionPercentage AS DECIMAL) / 100)) as Total_Commission,
		  (Select Sum(r.CommAmount) from ReceiptTbl r where r.ReceiptNo = main.ApplicationNo) as Amount_Paid
      FROM
        MainAppForm main
      INNER JOIN
        AgentTbl agent ON main.Agent = agent.AgentID
      WHERE
        agent.AgentName = ${agentName}
    `;

    const commission = mainForms.map((mainForm) => {
      return {
        ApplicationNo : mainForm.ApplicationNo,
        File_No : mainForm.File_No,
        Applicant_Name : mainForm.Applicant_Name,
        Total_Amount : mainForm.Total_Amount,
        Commission_Percentage : mainForm.Commission_Percentage,
        Total_Commission : mainForm.Total_Commission,
        Amount_Paid : mainForm.Amount_Paid,
        Balance : parseInt(mainForm.Total_Commission ? mainForm.Total_Commission : 0 - mainForm.Amount_Paid ? mainForm.Amount_Paid : 0)
      }
    })

    const jsonSerializer = JSONbig({ storeAsString: true });
    const serializedmainForms = jsonSerializer.stringify(commission);
    res.send(serializedmainForms);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
