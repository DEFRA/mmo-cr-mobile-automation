import { BasePage } from './basePage';

export class SignInPage extends BasePage {
    get crownLogo() {
        return $('~GOV.UK Crown Logo');
    }

    get heading() {
        return $('//android.widget.TextView[@text="Sign in" and @heading="true"]');
    }

    get emailField() {
        return $('//android.widget.EditText[@password="false"]');
    }

    get passwordField() {
        return $('//android.widget.EditText[@password="true"]');
    }

    get signInButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Sign in"]]',
        );
    }

    get troubleSigningInText() {
        return $('//android.widget.TextView[@text="Having trouble signing in?"]');
    }

    get forgottenPasswordLink() {
        return $('//android.widget.TextView[@text="Forgotten your password?"]');
    }

    get createAccountLink() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Create an account"]]',
        );
    }

    async enterEmail(email: string) {
        await this.emailField.setValue(email);
    }

    async enterPassword(password: string) {
        await this.passwordField.setValue(password);
    }

    async signIn(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.signInButton.click();
    }

    async openForgottenPassword() {
        await this.forgottenPasswordLink.click();
    }

    async openCreateAccount() {
        await this.createAccountLink.click();
    }
}

export default new SignInPage();
