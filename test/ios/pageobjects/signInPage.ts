import { BasePage } from './basePage';
import { logStep, logWarn, logError } from '../../common/logger';

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
        logStep('enterEmail with email: ' + email.substring(0, 3) + '***');
        await this.emailField.setValue(email);
    }

    async enterPassword(password: string) {
        logStep('entering password');
        await this.passwordField.setValue(password);
    }

    async togglePasswordVisibility() {
        logStep('togglePasswordVisibility');
        await this.passwordVisibilityToggle.click();
    }

    async signIn(email: string, password: string) {
        logStep('signIn flow start');
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.signInButton.click();
        await this.dismissSavePasswordPrompt();
    }

    async switchToWelsh() {
        logStep('switchToWelsh');
        await this.languageToggle.click();
    }

    async openForgottenPassword() {
        logStep('openForgottenPassword');
        await this.forgottenPasswordLink.click();
    }

    async openCreateAccount() {
        logStep('openCreateAccount');
        await this.createAccountLink.click();
    }
}

export default new SignInPage();
