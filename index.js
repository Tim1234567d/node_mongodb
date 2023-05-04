import express from "express" 
import mongoose from "mongoose" 
import { loginValidation, registerValidation, postCreateValidation } from "./validations.js"
import multer from "multer"
import { UserController, PostController } from "./controllers/index.js"
import {checkAuth, handleValidationErrors } from "./utils/index.js"
import cors from "cors"; // эта библиотека нужна для того чтобы соеденить frontend и backend



// ****************************************************** new part
 mongoose.connect(
    "mongodb+srv://baisalovt:123456qwertz@cluster0.7pl0ups.mongodb.net/blog?retryWrites=true&w=majority")  
.then(() => console.log("DB ok"))  
.catch((err) => console.log("DB error", err)) 

// ***********
const app = express() 

// **********
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
      }
      cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage });

// ***********
app.use(express.json()) 
app.use(cors());
app.use('/uploads', express.static('uploads')); // Таким образом мы проверяем есть ли загруженные файлы в папке uploads

// ****************************************************** new part
app.post("/auth/login",  loginValidation, handleValidationErrors, UserController.login);

// ****************************************************** new part
app.post("/auth/register",  registerValidation, handleValidationErrors, UserController.register);

// ****************************************************** new part
app.get("/auth/me", checkAuth, UserController.getMe);


// ****************************************************** new part получение статей
app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update,);


// ****************************************************** new part
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  });


// ****************************************************** new part
app.listen(3001,(err) => {
    if(err) {
        return console.log(err)
    }
    console.log("Server ok")
} )  

