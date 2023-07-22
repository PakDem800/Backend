var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

var { isAdmin,protect } = require('../middleware/authMiddleware')

const jsonSerializer = JSONbig({ storeAsString: true });

//All agents
router.get('/', protect ,isAdmin,async function (req, res, next) {
  try {
    const allAgents = await prisma.agentTbl.findMany();
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedallAgents = jsonSerializer.stringify(allAgents);

    res.send(serializedallAgents);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Get 1 agent
router.get('/details',protect,isAdmin, async function (req, res, next) {
  try {

    const { AgentID } =  req.body

    const allAgents = await prisma.agentTbl.findFirst({
      where : {
        AgentID : parseInt(AgentID)
      }
    });
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedallAgents = jsonSerializer.stringify(allAgents);

    res.send(serializedallAgents);

  } catch (error) {
    console.error(error);
    next(error);
  }
});




//create agents
router.post('/createAgent',protect,isAdmin, async function (req, res, next) {
  try {
    const {
      RegistrationDate,
      AgentName,
      AgentCNICNo,
      AgentFatherName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      Phone,
      Email,
      CommissionPercentage,
      DownPaymentCommission,
      InstallmentCommission,
      OpeningBalance,
      OpeningBalanceDate,
    } = req.body;

    const data = {
      RegistrationDate : new Date(RegistrationDate),
      AgentName,
      AgentCNICNo,
      AgentFatherName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      Phone,
      Email,
      CommissionPercentage,
      DownPaymentCommission,
      InstallmentCommission,
      OpeningBalance,
      OpeningBalanceDate : new Date(OpeningBalanceDate),
    };

    console.log(data);

    // Now you can use 'data' to create a new AgentTbl record in the database.
    // For example, using Prisma:
    const newAgent = await prisma.agentTbl.create({
      data: data,
    });

    console.log(newAgent);
    const serializedNewAgent = jsonSerializer.stringify(newAgent);

    res.status(200).json(serializedNewAgent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Update Agent
router.put('/updateAgent',protect,isAdmin, async function (req, res, next) {
  try {
    const {
      AgentID ,
      RegistrationDate,
      AgentName,
      AgentCNICNo,
      AgentFatherName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      Phone,
      Email,
      CommissionPercentage,
      DownPaymentCommission,
      InstallmentCommission,
      OpeningBalance,
      OpeningBalanceDate,
    } = req.body;

    const data = {
      RegistrationDate : new Date(RegistrationDate),
      AgentName,
      AgentCNICNo,
      AgentFatherName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      Phone,
      Email,
      CommissionPercentage,
      DownPaymentCommission,
      InstallmentCommission,
      OpeningBalance,
      OpeningBalanceDate : new Date(OpeningBalanceDate),
    };

    console.log(data);

    // Now you can use 'data' to create a new AgentTbl record in the database.
    // For example, using Prisma:
    const updatedAgent = await prisma.agentTbl.update({
      where:{
        AgentID : parseInt(AgentID)
      },
      data: data,
    });

    console.log(updatedAgent);
    const serializedupdatedAgent = jsonSerializer.stringify(updatedAgent);

    res.status(200).json(serializedupdatedAgent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//delete
router.delete('/delete', protect,isAdmin,async function (req, res, next) {
  try {

    const { AgentID } =  req.body

    const allAgents = await prisma.agentTbl.delete({
      where : {
        AgentID : parseInt(AgentID)
      }
    });
    res.status(200).json({
      success: true,
      message: `Agent with AgentID ${AgentID} has been deleted successfully.`
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
