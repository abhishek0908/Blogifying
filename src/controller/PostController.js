const express = require('express')
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const {userMiddleWare} = require('../middleware/userMiddleware')

router.get('/myposts',userMiddleWare,async(req,res)=>{
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                OR: [
                    { username: req.user },
                    { email: req.user },
                ],
            },
        });
        console.log(user.uuid);
        const posts = await prisma.post.findMany({
            where: {
                authorId: user.uuid, // Assuming `userId` is the field in your `post` table that references the user's UUID
            },
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve posts' });
    }
})


module.exports = router