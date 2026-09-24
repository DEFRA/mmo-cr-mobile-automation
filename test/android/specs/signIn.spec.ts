import SignInPage from '../pageobjects/signInPage';

describe('Android sign-in screen', () => {
    beforeEach(async () => {
        await SignInPage.openApp();
    });

    afterEach(async () => {
        await SignInPage.close();
    });

    it('displays the sign-in controls', async () => {
        await expect(SignInPage.heading).toBeDisplayed();
        await expect(SignInPage.emailField).toBeDisplayed();
        await expect(SignInPage.passwordField).toBeDisplayed();
        await expect(SignInPage.signInButton).toBeDisplayed();
        await expect(SignInPage.forgottenPasswordLink).toBeDisplayed();
        await expect(SignInPage.createAccountLink).toBeDisplayed();
    });

    it('accepts email and password input', async () => {
        await SignInPage.enterEmail('test@example.com');
        await SignInPage.enterPassword('Password123!');

        expect(await SignInPage.emailField.getText()).toBe('test@example.com');
        expect((await SignInPage.passwordField.getText())?.length).toBe(12);
    });

    it('handles empty credentials without losing the sign-in controls', async () => {
        await SignInPage.enterEmail('');
        await SignInPage.enterPassword('');

        expect(await SignInPage.emailField.getText()).toBe('');
        expect(await SignInPage.passwordField.getText()).toBe('');
        await expect(SignInPage.signInButton).toBeDisplayed();
    });

    it('handles whitespace and special characters in credentials', async () => {
        const email = '  test+tag@example.com  ';
        const password = ' P@ss w0rd!#$  ';

        await SignInPage.enterEmail(email);
        await SignInPage.enterPassword(password);

        expect(await SignInPage.emailField.getText()).toBe(email);
        expect((await SignInPage.passwordField.getText())?.length).toBe(password.length);
    });

    it('handles long credential values', async () => {
        const email = `${'a'.repeat(64)}@example.com`;
        const password = 'P'.repeat(128);

        await SignInPage.enterEmail(email);
        await SignInPage.enterPassword(password);

        expect(await SignInPage.emailField.getText()).toBe(email);
        expect((await SignInPage.passwordField.getText())?.length).toBe(password.length);
    });
});
