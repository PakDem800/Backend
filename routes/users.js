var express = require('express');
var router = express.Router();
var generateToken = require('../utils/generateToken')

const { PrismaClient } = require('@prisma/client');
const JSONbig = require('json-bigint');

const prisma = new PrismaClient();

const jsonSerializer = JSONbig({ storeAsString: true });

var { isAdmin,protect } = require('../middleware/authMiddleware')



router.post('/createUser',protect,isAdmin,async function (req, res, next) {
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

    const user = await prisma.usersTbl.findFirst({
      where: {
        UserName,
      },
    });

    // If user not found, return error for incorrect username
    if (!user) {
      return res.status(401).json({ message: 'Incorrect username' });
    }

    // Compare the provided password with the password in the database
    if (user.Password !== Password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // If user is found and password matches, return success response
    return res.status(200).json({
      user: user,
      token: generateToken(user.RolesID),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
