var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

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


module.exports = router;
