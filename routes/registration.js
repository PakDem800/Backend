var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();
const jsonSerializer = JSONbig({ storeAsString: true });

router.get('/', async function (req, res, next) {
  try {
    const allregistrations = await prisma.registrationTbl.findMany();
    const jsonSerializer = JSONbig({ storeAsString: true });

    // Serialize the BigInt values using json-bigint
    const serializedregistrations = jsonSerializer.stringify(allregistrations);

    res.send(serializedregistrations);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Get 1 Registered Investor
router.get('/details', async function (req, res, next) {
  try {

    const { RegisterationID  } =  req.body

    const allAgents = await prisma.registrationTbl.findFirst({
      where : {
        RegisterationID  : parseInt(RegisterationID )
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

//create
router.post('/createRegistration', async function (req, res, next) {
  try {
    const {
      RegistrationDate,
      Name,
      CNICNo,
      SpouseName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      ContactNo,
      Email,
      RegistrationAs,
      UserName,
      Password,
    } = req.body;

    const data = {
      RegistrationDate : new Date(RegistrationDate),
      Name,
      CNICNo,
      SpouseName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      ContactNo,
      Email,
      RegistrationAs,
      UserName,
      Password,
    };

    console.log(data);

    const newRegistration = await prisma.registrationTbl.create({
      data: data,
    });

    console.log(newRegistration);
    const serializedNewRegistration = jsonSerializer.stringify(newRegistration);

    res.status(200).json(serializedNewRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.put('/updateRegistration', async function (req, res, next) {
  try {
    const {
      RegisterationID,
      RegistrationDate,
      Name,
      CNICNo,
      SpouseName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      ContactNo,
      Email,
      RegistrationAs,
      UserName,
      Password,
    } = req.body;

    const data = {
      RegistrationDate : new Date(RegistrationDate),
      Name,
      CNICNo,
      SpouseName,
      CompanyName,
      CompanyAddress,
      OfficeNo,
      ContactNo,
      Email,
      RegistrationAs,
      UserName,
      Password,
    };

    console.log(data);

    const updateRegistration = await prisma.registrationTbl.update({

      where:{
        RegisterationID : parseInt(RegisterationID),
      } ,
      data: data,
    });

    console.log(updateRegistration);
    const serializedupdateRegistration = jsonSerializer.stringify(updateRegistration);

    res.status(200).json(serializedupdateRegistration);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Delete 
router.delete('/delete', async function (req, res, next) {
  try {

    const  { RegisterationID  } = req.body

    const allregisteration = await prisma.registrationTbl.delete({
      where:{
        RegisterationID : parseInt(RegisterationID),
      }
    });
    res.status(200).json({
      success: true,
      message: `Registeration of Investor with RegisterationID ${RegisterationID} has been deleted successfully.`
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
