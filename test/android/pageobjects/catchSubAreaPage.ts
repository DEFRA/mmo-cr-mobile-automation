import { BasePage } from './basePage';

export class CatchSubAreaPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[contains(@text, "Select the statistical sub area") and @heading="true"]',
        );
    }

    get instructionText() {
        return $('//android.widget.TextView[contains(@text, "The statistical areas nearest")]');
    }

    subAreaOption(areaCode: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[@text="${areaCode}"]]`,
        );
    }

    get otherOption() {
        return $(
            '//android.view.View[@checkable="true"][.//android.widget.TextView[@text="Other"]]',
        );
    }

    async selectSubArea(areaCode: string) {
        const option = this.subAreaOption(areaCode);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    async selectOther() {
        await this.otherOption.waitForDisplayed({ timeout: 10000 });
        await this.otherOption.click();
    }

    async selectSubAreaAndContinue(areaCode: string) {
        await this.selectSubArea(areaCode);
        await this.saveAndContinue();
    }
}

export default new CatchSubAreaPage();
