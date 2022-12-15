token = window.localStorage.token

if (!token) {
    window.location.href = "/auth";
}

const options = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

fetch('http://94.19.156.115:5000/auth/check', options)
    .then(response => response.json())
    .then(response => {
        if (response.id) {
            return webSoc(response.login)
        }
        window.location.href = "auth.html";
    })

function webSoc() {
    const ws = new WebSocket('ws://94.19.156.115:3000/' + '?token=' + window.localStorage.token)

    const form = document.getElementById('form')
    const output = document.getElementById('output')
    const input = document.getElementById('input')

    form.addEventListener('submit', event => {
        event.preventDefault()

        ws.send(JSON.stringify({message: input.value}))
        input.value = ''
    })

    function send(message) {
        const li = document.createElement('li')

        li.innerHTML = message
        output.appendChild(li)
    }

    ws.onopen = () => {
        //send('Server open')
    }

    ws.onclose = () => {
        send('Server has been closed')
    }

    ws.onmessage = (res) => {
        res = JSON.parse(res.data)
        switch (res.type) {
            case 'message':
                send(res.message)
                break
            case 'error':
                window.location.href = "/auth";
                break
        }
    }
}