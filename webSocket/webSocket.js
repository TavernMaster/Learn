import WebSocket, {WebSocketServer} from 'ws'
import url from "url"
import jwt from 'jsonwebtoken'

const server = new WebSocketServer({port: 3000})

let historyMessages  = []

try {
    server.on('connection', (ws, req) => {
        const token = url.parse(req.url, true).query.token
        if (token) {
            jwt.verify(token, global.secretJwt, (err, decoded) => {
                if (err) {
                    ws.close()
                } else {
                    ws.token = token
                    ws.jwt = decoded
                }
            })
        } else {
            ws.close()
        }

        ws.on('message', message => {
            jwt.verify(ws.token, global.secretJwt, (err, decoded) => {
                if (err) {
                    client.send(JSON.stringify({type: 'error', message: 'Токен устарел'}))
                    ws.close()
                }
            })
            message = JSON.parse('' + message)
            const messageString = `${ws.jwt.login} =>  ${message.message}`
            historyMessages.push(messageString)
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: 'message', message: messageString}))
                }
            })
        })

        historyMessages.forEach(message => {
            ws.send(JSON.stringify({type: 'message', message: message}))
        })
    })
}
catch (e) {
    console.log(e)
}
