import { BasePage } from './basePage';

export class SignInPage extends BasePage {
    get heading() {
        return $('~SignIn.heading');
    }

    get emailField() {
        return $('//XCUIElementTypeTextField[@name="SignIn.emailField"]');
    }

    get passwordField() {
        return $('~TextInputField.secureInput');
    }

    get passwordVisibilityToggle() {
        return $('~TextInputField.secureToggle');
    }

    get signInButton() {
        return $('~SignIn.signInButton');
    }

    get troubleSigningInHeading() {
        return $('~SignIn.troubleHeading');
    }

    get forgottenPasswordLink() {
        return $('~SignIn.forgottenPasswordLink');
    }

    get createAccountLink() {
        return $('~SignIn.createAccountLink');
    }

    async enterEmail(email: string) {
        await this.emailField.setValue(email);
    }

    async enterPassword(password: string) {
        await this.passwordField.setValue(password);
    }

    async togglePasswordVisibility() {
        await this.passwordVisibilityToggle.click();
    }

    async signIn(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.signInButton.click();
        await this.dismissSavePasswordPrompt();
    }

    async switchToWelsh() {
        await this.languageToggle.click();
    }

    async openForgottenPassword() {
        await this.forgottenPasswordLink.click();
    }

    async openCreateAccount() {
        await this.createAccountLink.click();
    }
}

export default new SignInPage();
