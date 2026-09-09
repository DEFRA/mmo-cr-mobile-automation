import SignInPage from '../pageobjects/signInPage';
import { simulateOffline, simulateOnline } from '../../common/networkProxyClient';

// Requires the proxy-controller sidecar (npm run proxy:controller) with the
// iOS Simulator's Wi-Fi proxy pointed at it — see scripts/proxy-controller.ts.
describe('iOS app launch in offline mode', () => {
    afterEach(async () => {
        await SignInPage.close();
        await simulateOnline();
    });

    it('launches the app and shows the sign-in screen while offline', async () => {
        await simulateOffline();
        await SignInPage.openApp();

        await expect(SignInPage.heading).toBeDisplayed();
        await expect(SignInPage.emailField).toBeDisplayed();
        await expect(SignInPage.signInButton).toBeDisplayed();
    });

    it('PROBE', async () => {
        await simulateOffline();
        await SignInPage.openApp();
        await SignInPage.signIn('probe@example.com', 'Password123!');
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('PAGE SOURCE START');
        console.log(await driver.getPageSource());
        console.log('PAGE SOURCE END');
    });
});
