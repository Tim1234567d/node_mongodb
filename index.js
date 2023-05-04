import express from "express" 
import mongoose from "mongoose" 
import {registerValidation} from "./validations/auth.js" 
import { loginValidation, registerValidation, postCreateValidation } from "./validations.js"
import checkAuth from "./utils/checkAuth.js"
import * as UserController from "./controllers/UserController.js"


// ****************************************************** new part
 mongoose.connect(
    "mongodb+srv://baisalovt:123456qwertz@cluster0.7pl0ups.mongodb.net/blog?retryWrites=true&w=majority")  
.then(() => console.log("DB ok"))  
.catch((err) => console.log("DB error", err)) 

// ***********
const app = express() 

// ***********
app.use(express.json()) 

// ****************************************************** new part
app.post("/auth/login", loginValidation, UserController.login);

// ****************************************************** new part
app.post("/auth/register",registerValidation, UserController.register);

// ****************************************************** new part
app.get('/auth/me', checkAuth, UserController.getMe);


// ****************************************************** new part
app.listen(3000,(err) => {
    if(err) {
        return console.log(err)
    }
    console.log("Server ok")
} )  

