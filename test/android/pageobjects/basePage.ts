import { CommonBasePage } from '../../common/commonBasePage';

export class BasePage extends CommonBasePage {
    protected readonly appId = process.env.ANDROID_APP_ID ?? 'uk.gov.defra.mmocatchrecord';

    get languageToggle() {
        return $('//android.widget.TextView[@text="CYM"]');
    }

    get govUkLogo() {
        return $('~GOV.UK');
    }

    get backButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Back"]]',
        );
    }

    get offlineBanner() {
        return $(
            '//android.widget.TextView[contains(@text, "saved and sent when you\'re back online")]',
        );
    }

    get catchRecordReference() {
        return $('//android.widget.ScrollView/android.widget.TextView[@drawing-order="0"]');
    }

    get saveAndContinueButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Save and continue"]]',
        );
    }

    async switchToWelsh() {
        await this.languageToggle.click();
    }

    async goBack() {
        await this.backButton.click();
    }

    async saveAndContinue() {
        await this.saveAndContinueButton.waitForDisplayed({ timeout: 10000 });
        await this.saveAndContinueButton.click();
    }

    async isOfflineBannerDisplayed(): Promise<boolean> {
        return this.offlineBanner.isDisplayed();
    }
}
