const express = require("express")
const router = express.Router()
const { PrismaClient } = require('@prisma/client');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const SECRET_KEY = require("../config")
const jwt = require('jsonwebtoken')
const {userMiddleWare} = require('../middleware/userMiddleware')
const prisma = new PrismaClient();
router.use(express.json());
router.get("/hello",(req,res)=>{
    res.send("I am inside home")
})

router.post('/register',async(req,res)=>{
    console.log("hello")
    const {first_name,last_name,password,username,email} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log(hashedPassword)
    const user  = await prisma.user.create({
        data : {
        "first_name":first_name,
        "last_name":last_name,
        "username":username,
        "email":email,
        "password":hashedPassword
    }})
    res.send({
        "user":user
    })
    
})

router.post('/login',async (req,res)=>{
    console.log(SECRET_KEY)
    const {usernameOrEmail, password} = req.body;
    if(!usernameOrEmail || !password){
        return res.status(400).json({ message: 'Username/Email and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.findFirstOrThrow({
        where: {
            OR: [
                { username: usernameOrEmail },
                { email: usernameOrEmail },
            ],
        },
    });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(401).json({ message: 'Invalid credentials' });

    }
    console.log("IT IS NOT FIX",isPasswordValid)
    if(!user){
        res.sendStatus(404).send("user not found")
    }
    const token = jwt.sign(usernameOrEmail, SECRET_KEY);
    res.send({
        "user":token
    })
})

router.get('/protected', userMiddleWare, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});
module.exports = router;

