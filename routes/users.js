var express = require('express');
var router = express.Router();

const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

const jsonSerializer = JSONbig({ storeAsString: true });



router.post('/createUser',async function (req, res, next) {
  try {
    const { UserName, Password, RolesID, LoginDateTime, IPAdderss } = req.body;

    const newUser = await prisma.usersTbl.create({
      data: {
        UserName,
        Password,
        RolesID,
        LoginDateTime,
        IPAdderss,
      },
    });

    console.log(newUser);
    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

router.post('/login', async function (req, res, next) {
  try {
    const { UserName, Password } = req.body;

    // Find the user with the provided username in the database
    const user = await prisma.usersTbl.findFirst({
      where: {
        UserName,
      },
    });

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the password in the database
    if (user.Password !== Password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // If user is found and password matches, return all user info
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
