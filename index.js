import express from "express" // так мы импортируем express

const app = express() // express равно app

app.get("/", (req, res) => {
  res.send("Hello world")
})  // сделали get запрос, который в качестве ответа отправляет Hello world

app.listen(4444,(err) => {
    if(err) {
        return console.log(err)
    }

    console.log("Server ok")
} )  // Эта строка обязательно нужна, какой порт должен слушать наш node js приложение

