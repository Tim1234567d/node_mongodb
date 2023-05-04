import express from "express" // так мы импортируем express
import jwt from "jsonwebtoken" // нужен для того чтобы шифровать данные в токен
import bcrypt from "bcrypt" // Нужно для того чтобы зашифровать пароль который приходит с frontend
import mongoose from "mongoose" // нужен для того чтобы подключиться к mongodb, мы его специально скачали с помощью npm install mongoose
import {registerValidation} from "./validations/auth.js" // мы импортировали нашу валидацию
import {validationResult} from "express-validator"  // этот пакет будет проверять есть ли ошибки в веденных данных или нет
import UserModel from "./models/User.js" // мы импортировали UserModel из паки models


// *************************************************
// Сондинение с mongodb 
 mongoose.connect(
    "mongodb+srv://baisalovt:123456qwertz@cluster0.7pl0ups.mongodb.net/blog?retryWrites=true&w=majority")   // так мы подключились к mongodb
.then(() => console.log("DB ok"))  // Если подключение прошло удачно то в консоле выводится "DB ok"
.catch((err) => console.log("DB error", err)) // Если при подключении произошла какая-либо ошибка мы выводим ее в консоле

const app = express() // express равно app

app.use(express.json()) // это нужно для того чтобы наше node.js приложение могло читать json запросы, без этого будет выходить undefined



// *************************************************
// Делаем post request для регистрации нового пользователя 
app.post("/auth/register",registerValidation, async(req, res) => {

    try {
        const errors = validationResult(req)  // мы взяли validationResult из пакета validationResult, этот пакет нужен для валидации
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    } // Если есть ошибки то верни статус 400


// *** Шифруем пароль пользователя который он ввел при регистрации
    const password = req.body.password; // так мы вытащили пароль с body
    const salt = await bcrypt.genSalt(10) // Это алгоритм шифрования пароля, то есть каким образом должен шифроваться пароль
    const hash = await bcrypt.hash(password, salt) // таким образом мы зашифровали пароль который ввел пользователь при регистрации


    // Таким образом мы создаем нашего пользователя в mongodb
    const doc = new UserModel({
        email: req.body.email,  // так мы вытащили email
        fullName: req.body.fullName, // так мы вытащили fullname
        avatarUrl: req.body.avatarUrl, // так мы вытащили avatartUrl
        passwordHash: hash,  // это зашифрованный пароль

    })

// *** в переменной doc хранятся все данные которые ввел пользователь при регистрации. Теперь переменная doc равна переменной user
    const user = await doc.save();  // таким образом мы сохранили все данные в mongodb 

// *** Мы создаем токен для пользователя, токен истечет через 30 дней
    const token = jwt.sign({
        _id: user._id,    // в переменной user есть id пользователя. Для этого id мы сделали токен
    },
    "secret123",
    {
        expiresIn: "30d",  // столько дней будет жить токен
    }
    )

// *** Скрытие некоторых данных которые показывались бы в консоле
const {passwordHash, ...userData} = user._doc  // таким образом мы скрыли отображение passwordHash в консоле, иначе бы эта информация показывалась бы в консоле вместе с другими данными

// *** Вернуть ответ со всеми данными в формате json
    res.json({
        ...userData,  // Здесь хранятся все данные которые ввел пользователь при регистрации
        token,  // А таким образом мы возвращаем токен пользователя
    }) 

// *** Если произашла ошибка, то возвращаем ответ с "Не удалось зарегистрироваться"
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        })
    }

    
})   // Здесь заканчивается вся логика процесса регистрации



// *************************************************
// *** Начало процесса login
app.post("/auth/login", async(req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email }); // таким образом мы находим введенный email в базе данных

        if(!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            })
        } // Если пользователь не найден, то верни ответ "Пользователь не найден"

// *** Сравнение введенного пароля с паролем в базе данных
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);  // сравниваем пароли

        if (!isValidPass) {
            return res.status(400).json({
                message: "Неверный логин или пароль",
            })
        } // Если введенный пароль не true, то верни ответ "Неверный логин или пароль"


// *** Мы создаем токен для пользователя, токен истечет через 30 дней
        const token = jwt.sign({
            _id: user._id, // в переменной user есть id пользователя. Для этого id мы сделали токен
        },
        "secret123",
        {
            expiresIn: "30d",  // столько дней будет жить токен
        }
        )

// *** Все данные теперь в переменной user._doc  
    const {passwordHash, ...userData} = user._doc  
     
       res.json({
        ...userData, // Здесь хранятся все данные пользователя
        token, // Здесь хранится токен пользователя
    }) // Возвращаем ответ в формате json


// *** Если произашла ошибка, то возвращаем ответ с "Не удалось зарегистрироваться"
    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось авторизоваться",  // 
        })
    }
}) // Здесь заканчивается вся логика процесса login




// *************************************************
// На каком порту должно запускаться node.js приложение
app.listen(3000,(err) => {
    if(err) {
        return console.log(err)
    }

    console.log("Server ok")
} )  // Эта строка обязательно нужна, какой порт должен слушать наше node.js приложение

