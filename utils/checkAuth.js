import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');  // Таким образом мы удалили слова Bearer которое автоматически создается программой

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123'); // таким образом мы расшифровали токен

      req.userId = decoded._id;
      next(); // Если удалось расшифровать токен, то следующую функцию
    } catch (e) {
      return res.status(403).json({
        message: 'Нет доступа',
      }); // Если  мы не смогли расшифровать токен, то выведи сообщение 'Нет доступа'
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    }); // Если токена не будет то верни ответ 'Нет доступа'
  }

};