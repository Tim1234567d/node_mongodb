import express from "express" // так мы импортируем express
import jwt from "jsonwebtoken" // нужен для того чтобы шифровать данные в токен
import bcrypt from "bcrypt" // Нужно для того чтобы зашифровать пароль который приходит с frontend
import mongoose from "mongoose" // нужен для того чтобы подключиться к mongodb, мы его специально скачали с помощью npm install mongoose
import {registerValidation} from "./validations/auth.js" // мы импортировали нашу валидацию
import {validationResult} from "express-validator"  // этот пакет будет проверять есть ли ошибки в веденных данных или нет
import UserModel from "./models/User.js"



// ***********************
 mongoose.connect(
    "mongodb+srv://baisalovt:123456qwertz@cluster0.7pl0ups.mongodb.net/blog?retryWrites=true&w=majority")   // так мы подключились к mongodb
.then(() => console.log("DB ok"))  // Если подключение прошло удачно то в консоле выводится "DB ok"
.catch((err) => console.log("DB error", err)) // Если при подключении произошла какая-либо ошибка мы выводим ее в консоле

const app = express() // express равно app

app.use(express.json()) // это нужно для того чтобы наше node.js приложение могло читать json запросы, без этого будет выходить undefined



// ***********************************

app.post("/auth/register",registerValidation, async(req, res) => {

    try {
        const errors = validationResult(req)  // мы взяли validationResult из пакета validationResult, этот пакет нужен для валидации
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    } // Если есть ошибки то верни статус 400


    const password = req.body.password; // так мы вытащили пароль с body
    const salt = await bcrypt.genSalt(10) // Это алгоритм шифрования пароля, то есть каким образом должен шифроваться пароль
    const passwordHash = await bcrypt.hash(password, salt) // таким образом мы зашифровали пароль

    const doc = new UserModel({
        email: req.body.email, 
        fullName: req.body.fullName, 
        avatarUrl: req.body.avatarUrl, 
        passwordHash,  // это зашифрованный пароль

    })

    const user = await doc.save();  // таким образом мы сохранили все данные 




    res.json(user) // как ответ вернули все данные которые сохранили


    } catch (err) {
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        })
    }

    
})


// ****************************************
app.listen(3000,(err) => {
    if(err) {
        return console.log(err)
    }

    console.log("Server ok")
} )  // Эта строка обязательно нужна, какой порт должен слушать наш node js приложение

