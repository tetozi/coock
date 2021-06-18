import { login, register, apilogout, checkResult } from '../api.js';
import { showInfo, showError } from '../notification.js'



export async function registerPage() {
    this.partials = {
        header: await this.load('./view/common/header.hbs'),
        footer: await this.load('./view/common/footer.hbs'),

    };

    this.partial('./view/users/register.hbs');
}

export async function loginPage() {
    this.partials = {
        header: await this.load('./view/common/header.hbs'),
        footer: await this.load('./view/common/footer.hbs'),

    };

    this.partial('./view/users/login.hbs');
}

export async function logout() {
    try {
        const result = await apilogout();
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        this.app.userData.email = '';
        this.app.userData.userId = '';

        showInfo('Successfully logged out');

        this.redirect('#/home');
    } catch (err) {
        console.error(err);
        showError(err.message);
    }
}

export async function registerPost() {

    try {
        if (this.params.password !== this.params.repeatPassword) {
            throw new Error('Password don\'t match');
        }
        if (this.params.email.length < 3) {
            throw new Error('Email must be atleast 3 characters long');
        }
        if (this.params.password.length < 6) {
            throw new Error('Password must be atleast 6 characters long');
        }


        const result = await register(
            this.params.email,
            this.params.password
        );
        userData
        checkResult(result)
        const loginResult = await login(this.params.email, this.params.password);
        checkResult(loginResult);
        this.app.userData.email -= loginResult.email
        this.app.userData.userId = loginResult.userId
        showInfo('Successfully registerd');
        this.redirect('#/home');

    } catch (err) {

        showError(err.message);
    }
}


export async function loginPost() {
    try {
        const result = await login(
            this.params.email,
            this.params.password
        );
        checkResult(result);

        this.app.userData.email = result.email
        this.app.userData.userId = result.object

        showInfo('Login successfull')
        this.redirect('#/home')
    } catch (err) {
        showError(err.message)
    }
}