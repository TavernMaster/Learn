import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'


const jwtGenerate = (id, login) => {
    const payload = {
        id,
        login
    }
    return jwt.sign(payload, global.secretJwt, {expiresIn: '1h'})
}

class UserController {

    async createUser(req, res) {
        const find = await db.query('select * from users where login = $1', [req.body.login])
        if (find.rowCount !== 0) return res.status(400).json('Пользователь с таким логином уже существует')

        bcrypt.hash(req.body.password, 10, async (err, pass) => {
            const newUser = await db.query('insert into users (login, password, email) values ($1, $2, $3) returning *', [req.body.login, pass, req.body.email])
            res.status(201).json(newUser.rows[0])
        })
    }

    async authUser(req, res) {
        console.log(`Пользователь ${req.body.login} авторизован`)
        const find = await db.query('select * from users where login = $1', [req.body.login])
        if (find.rowCount) {
            bcrypt.compare(req.body.password, find.rows[0].password, (err, result) => {
                if (result) {
                    const token = jwtGenerate(find.rows[0].id, find.rows[0].login)
                    res.status(200).json({token: token})
                } else {
                    res.status(401).json('false')
                }
            })
        } else {
            res.status(401).json('false')
        }
    }

    async checkUser(req, res) {
        try {
            if (!req.headers.authorization) return res.status(401).json('Вы не авторизованы')
            const decoded = jwt.verify(req.headers.authorization.split(' ')[1], global.secretJwt)
            if (decoded) {
                return res.status(201).json(decoded)
            }
            res.status(401).json('Вы не авторизованы')
        }
        catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    async getUser(req, res) {
        try {
            const token = req.headers.authorization
            const decodedToken = jwt.verify(token, secretKeyJwt)
            if (decodedToken) {
                res.status(201).json({id: decodedToken.id, login: decodedToken.login})
            }
        }

        catch (e) {
            res.status(400).json('пользователь не авторизован')
        }
    }

    async updateUser(req, res) {
        const updUser = await db.query('update users set login = $1, password = $2 where id = $3 returning *', [req.body.login, req.body.password, req.params.id])
        res.json(updUser.rows[0])
    }

    async deleteUser(req, res) {
        await db.query('delete from users where id = $1', [req.params.id])
        res.json(`Пользователь с ID ${req.params.id} удален.`)
    }
}

const controller = new UserController()

export default controller