let loginPage = true;
let oldLog = localStorage.login

if (oldLog) {
    document.getElementById('login').value = oldLog;
};

function oldLoginFunc(oldLogin) {
    if (oldLogin) {
        document.getElementById('login').value = oldLogin;
    };
    oldLog = oldLogin;
};

function enter() {
    if (loginPage == true) {
        return loginAttempt();
    } else {
        return registerAttempt();
    };
};

function showRegister() {
    document.getElementById('LoginForm').style.display = 'none';
    document.getElementById('RegisterForm').style.display = 'block';
    hideError('error-reg');
    loginPage = false;
};

function showLogin() {
    document.getElementById('LoginForm').style.display = 'block';
    document.getElementById('RegisterForm').style.display = 'none';
    hideError('error-log');
    loginPage = true;
    if (oldLog) {
        document.getElementById('login').value = oldLog;
    };
};

function loginAttempt() {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    localStorage.login = login
    if (!login && password) {
        return showLoginError('Введите логин');
    };
    if (login.length < 5) {
        return showLoginError('Слишком короткий логин');
    };
    if (login && !password) {
        return showLoginError('Введите пароль');
    };
    if (password.length < 5) {
        return showLoginError('Слишком короткий пароль');
    };
    hideError('error-log');

    const params = {
        "login": login,
        "password": password,
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(params),
    };
    fetch('http://94.19.156.115:5000/auth', options)
    .then(response => response.json())
    .then(response => {
        if (response.token) {
            window.localStorage.token = response.token
            window.location.href = "/";
            return
        }
        showLoginError('Неверный логин или пароль');
    });
};

function registerAttempt() {
    const regLogin = document.getElementById('login-reg').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password-reg').value;
    const repeatPassword = document.getElementById('repeat-password').value;
    const mailValid = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/i;
    const emailLower = email.toLowerCase();
    validEmail = mailValid.test(email);

    if (!regLogin) {
        return showRegisterError('Введите логин');
    };
    if (!email) {
        return showRegisterError('Введите почту');
    };
    if (!password) {
        return showRegisterError('Введите пароль');
    };
    if (!repeatPassword) {
        return showRegisterError('Повторите пароль');
    };
    if (regLogin.length < 5) {
        return showRegisterError('Слишком короткий логин');
    };
    if (validEmail == false) {
        return showRegisterError('Некорректный адресс электронной почты');
    };
    if (password.length < 5) {
        return showRegisterError('Слишком короткий пароль');
    };
    if (repeatPassword !== password) {
        return showRegisterError('Пароли не совпадают');
    };
    hideError('error-reg');

    const params = {
        "login": regLogin,
        "password": password,
        "email": emailLower,
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(params),
    };
    fetch('http://94.19.156.115:5000/register', options)
    .then(response => response.json())
    .then(response => {
        showRegisterError(`Вы зарегистрированы как ${response.login}`);
    });
};

function showLoginError(message) {
    const errorBlock = document.getElementById('error-log');
    errorBlock.innerText = message;
    errorBlock.style.display = 'block';
};

function showRegisterError(message) {
    const errorBlock = document.getElementById('error-reg');
    errorBlock.innerText = message;
    errorBlock.style.display = 'block';
};

function hideError(id) {
    const errorBlock = document.getElementById(id);
    errorBlock.style.display = 'none';
};