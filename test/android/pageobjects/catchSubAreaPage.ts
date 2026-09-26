import { BasePage } from './basePage';
import { logStep } from '../../common/logger';

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
        logStep(`Selecting sub area ${areaCode}`);
        const option = this.subAreaOption(areaCode);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    async selectOther() {
        logStep('Selecting Other');
        await this.otherOption.waitForDisplayed({ timeout: 10000 });
        await this.otherOption.click();
    }

    async selectSubAreaAndContinue(areaCode: string) {
        logStep(`Selecting sub area and continuing: ${areaCode}`);
        await this.selectSubArea(areaCode);
        await this.saveAndContinue();
    }
}

export default new CatchSubAreaPage();
