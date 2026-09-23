import { BasePage } from './basePage';

export class CatchAreaPage extends BasePage {
    /** The heading is dynamic and includes the gear type, e.g. "Where was the majority of your catch caught using seine nets..." */
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Where was the majority of your catch caught") and @heading="true"]',
        );
    }

    get instructionText1() {
        return $('//android.widget.TextView[contains(@text, "The statistical areas nearest")]');
    }

    get instructionText2() {
        return $('//android.widget.TextView[contains(@text, "Select the area where most")]');
    }

    get instructionText3() {
        return $('//android.widget.TextView[contains(@text, "If it is not listed, select Other")]');
    }

    // --- Area Selection ---

    /** Select a statistical area radio button by code (e.g. "38E95", "37F02") */
    areaOption(areaCode: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[@text="${areaCode}"]]`,
        );
    }

    /** The 'Other' button to manually enter an area not listed */
    get otherButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Other"]]',
        );
    }

    // --- Actions ---

    async selectArea(areaCode: string) {
        const option = this.areaOption(areaCode);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    async clickOther() {
        await this.otherButton.waitForDisplayed({ timeout: 10000 });
        await this.otherButton.click();
    }

    /** Select a predefined statistical area and continue */
    async selectAreaAndContinue(areaCode: string) {
        await this.selectArea(areaCode);
        await this.saveAndContinue();
    }
}

export default new CatchAreaPage();
