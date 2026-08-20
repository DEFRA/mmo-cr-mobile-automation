import SignInPage from '../pageobjects/signInPage';

describe('iOS sign-in screen', () => {
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
        await expect(SignInPage.passwordVisibilityToggle).toBeDisplayed();
        await expect(SignInPage.signInButton).toBeDisplayed();
        await expect(SignInPage.forgottenPasswordLink).toBeDisplayed();
        await expect(SignInPage.createAccountLink).toBeDisplayed();
    });

    it('accepts email and password input', async () => {
        await SignInPage.enterEmail('test@example.com');
        await SignInPage.enterPassword('Password123!');

        expect(await SignInPage.emailField.getAttribute('value')).toBe('test@example.com');
        expect((await SignInPage.passwordField.getAttribute('value'))?.length).toBe(12);
    });

    it('handles empty credentials without losing the sign-in controls', async () => {
        await SignInPage.enterEmail('');
        await SignInPage.enterPassword('');

        expect(await SignInPage.emailField.getAttribute('value')).toBeNull();
        expect(await SignInPage.passwordField.getAttribute('value')).toBeNull();
        await expect(SignInPage.signInButton).toBeDisplayed();
    });

    it('handles whitespace and special characters in credentials', async () => {
        const email = '  test+tag@example.com  ';
        const password = ' P@ss w0rd!#$  ';

        await SignInPage.enterEmail(email);
        await SignInPage.enterPassword(password);

        expect(await SignInPage.emailField.getAttribute('value')).toBe(email);
        expect((await SignInPage.passwordField.getAttribute('value'))?.length).toBe(
            password.length,
        );
    });

    it('handles long credential values', async () => {
        const email = `${'a'.repeat(64)}@example.com`;
        const password = 'P'.repeat(128);

        await SignInPage.enterEmail(email);
        await SignInPage.enterPassword(password);

        expect(await SignInPage.emailField.getAttribute('value')).toBe(email);
        expect((await SignInPage.passwordField.getAttribute('value'))?.length).toBe(
            password.length,
        );
    });

    it('allows the password visibility control to be toggled', async () => {
        await SignInPage.enterPassword('Password123!');
        await SignInPage.togglePasswordVisibility();
        await expect(SignInPage.passwordVisibilityToggle).toBeDisplayed();

        await SignInPage.togglePasswordVisibility();
        await expect(SignInPage.passwordVisibilityToggle).toBeDisplayed();
    });
});
