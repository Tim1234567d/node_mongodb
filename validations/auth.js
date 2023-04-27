import {body} from "express-validator"

export const registerValidation = [
    body("email", "Неверный формат почты").isEmail(), 
    body("password", "Пароль должен быть минимум 5 символов").isLength({min:5}), 
    body("fullName", "Укажите имя, имя должно состоять минимум из 3 символов").isLength({min:3}), 
    body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
]