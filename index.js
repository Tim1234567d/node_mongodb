import express from "express"

const app = express()

app.get("/", (req, res) => {
  res.send("Hello world this is my first node.js app")
})

app.listen(4444,(err) => {
    if(err) {
        return console.log(err)
    }

    console.log("Server ok")
} )