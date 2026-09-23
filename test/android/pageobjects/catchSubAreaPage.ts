import { BasePage } from './basePage';

export class CatchSubAreaPage extends BasePage {
    /** The heading is dynamic and includes the gear type, e.g. "Select the statistical sub area where the majority of your catch was caught..." */
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Select the statistical sub area") and @heading="true"]',
        );
    }

    get instructionText() {
        return $('//android.widget.TextView[contains(@text, "The statistical areas nearest")]');
    }

    // --- Sub Area Selection ---

    /** Select a statistical sub area radio button by code (e.g. "38E95", "37F02") */
    subAreaOption(areaCode: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[@text="${areaCode}"]]`,
        );
    }

    /** The 'Other' radio button option */
    get otherOption() {
        return $(
            '//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Other"]]',
        );
    }

    // --- Actions ---

    async selectSubArea(areaCode: string) {
        const option = this.subAreaOption(areaCode);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    async selectOther() {
        await this.otherOption.waitForDisplayed({ timeout: 10000 });
        await this.otherOption.click();
    }

    /** Select a predefined statistical sub area and continue */
    async selectSubAreaAndContinue(areaCode: string) {
        await this.selectSubArea(areaCode);
        await this.saveAndContinue();
    }
}

export default new CatchSubAreaPage();
