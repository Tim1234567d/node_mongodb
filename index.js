import { error } from "console"
import express from "express" // так мы импортируем express
import jwt from "jsonwebtoken" // нужен для того чтобы шифровать данные в токен
import mongoose from "mongoose"

 mongoose.connect(
    
    "mongodb+srv://baisalovt:123456qwertz@cluster0.7pl0ups.mongodb.net/?retryWrites=true&w=majority")   // так мы подключились к mongodb
.then(() => console.log("DB ok"))
.catch((err) => console.log("DB error", err))

const app = express() // express равно app

app.use(express.json()) // это нужно для того чтобы наше node.js приложение могло читать json запросы, без этого будет выходить undefined

app.get("/", (req, res) => {
  res.send("Hello world")
})  // сделали get запрос, который в качестве ответа отправляет Hello world


app.post("/auth/login", (req, res) => {
    console.log(req.body)  // просто чтобы посмотреть что находиться в body
        

    if(req.body.email === "test@gmail.com") {

         // c помощью jwt.sign мы превратили данные в токен
        const token = jwt.sign({
            email: req.body.email,
            fullname: "John Legend"
        },
        "secret123", // это ключь с помощью которого мы зашивровали наши данные которые находятся в токене
        
        )
    }
   
    res.json({
        success: true,
        token,
    })
})




app.listen(3000,(err) => {
    if(err) {
        return console.log(err)
    }

    console.log("Server ok")
} )  // Эта строка обязательно нужна, какой порт должен слушать наш node js приложение

