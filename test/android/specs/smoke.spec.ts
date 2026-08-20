import { BasePage } from '../pageobjects/basePage';

const basePage = new BasePage();

describe('Android app', () => {
    beforeEach(async () => {
        await basePage.openApp();
    });

    afterEach(async () => {
        await basePage.close();
    });

    it('opens on the home screen', async () => {
        await expect(basePage.tabHome).toBeDisplayed();
    });
});
