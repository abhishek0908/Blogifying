const express = require("express");
const app = express();
const PORT = 8000;
const PostController = require('./controller/PostController')
const UserController = require('./controller/UserController')
app.use("/auth",UserController)
app.use("/posts",PostController)
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});