import express from "express" // так мы импортируем express

const app = express() // express равно app

app.use(express.json()) // это нужно для того чтобы наше node.js приложение могло читать json запросы, без этого будет выходить undefined

app.get("/", (req, res) => {
  res.send("Hello world")
})  // сделали get запрос, который в качестве ответа отправляет Hello world


app.post("/auth/login", (req, res) => {
    console.log(req.body)
    res.json({
        success: true,
    })
})




app.listen(3000,(err) => {
    if(err) {
        return console.log(err)
    }

    console.log("Server ok")
} )  // Эта строка обязательно нужна, какой порт должен слушать наш node js приложение

