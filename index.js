import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import path from 'path'
import userRouter from './routes/user.router.js'
import ('./db.js')
import ('./webSocket/webSocket.js')

const app = express();
const PORT = process.env.PORT || 4000;
global.secretJwt = process.env.SECRET_KEY_JWT

app.use(express.json())
app.use(express.static(path.resolve('static')))
app.use(userRouter)

app.use(function (req, res, next) {
    res.status(404).json('Страница не найдена')
})

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`)
})