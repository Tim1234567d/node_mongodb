import express from "express" // так мы импортируем express
import jwt from "jsonwebtoken" // нужен для того чтобы шифровать данные в токен
import mongoose from "mongoose" // нужен для того чтобы подключиться к mongodb, мы его специально скачали с помощью npm install mongoose
import {registerValidation} from "./validations/auth.js" // мы импортировали нашу валидацию
import {validationResult} from "express-validator"  // этот пакет будет проверять есть ли ошибки в веденных данных или нет
import { resourceLimits } from "worker_threads"


// ***********************
 mongoose.connect(
    "mongodb+srv://baisalovt:123456qwertz@cluster0.7pl0ups.mongodb.net/?retryWrites=true&w=majority")   // так мы подключились к mongodb
.then(() => console.log("DB ok"))  // Если подключение прошло удачно то в консоле выводится "DB ok"
.catch((err) => console.log("DB error", err)) // Если при подключении произошла какая-либо ошибка мы выводим ее в консоле

const app = express() // express равно app

app.use(express.json()) // это нужно для того чтобы наше node.js приложение могло читать json запросы, без этого будет выходить undefined



// ***********************************

app.post("/auth/register",registerValidation, (req, res) => {

    const errors = validationResult(req)  // мы взяли validationResult из пакета validationResult
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    } // Если есть ошибки то верни статус 400

    res.json({
        success: true,
  })
})


// ****************************************
app.listen(3000,(err) => {
    if(err) {
        return console.log(err)
    }

    console.log("Server ok")
} )  // Эта строка обязательно нужна, какой порт должен слушать наш node js приложение

