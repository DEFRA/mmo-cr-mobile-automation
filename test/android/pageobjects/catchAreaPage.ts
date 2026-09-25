import { BasePage } from './basePage';
import { logStep, logWarn, logError } from '../../common/logger';

export class CatchAreaPage extends BasePage {
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

    areaOption(areaCode: string) {
        return $(
            `//android.view.View[@checkable="true"][.//android.widget.TextView[@text="${areaCode}"]]`,
        );
    }

    get otherButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Other"]]',
        );
    }

    async selectArea(areaCode: string) {
        logStep(`Selecting area ${areaCode}`);
        const option = this.areaOption(areaCode);
        await option.waitForDisplayed({ timeout: 10000 });
        await option.click();
    }

    async clickOther() {
        logStep('Clicking Other');
        await this.otherButton.waitForDisplayed({ timeout: 10000 });
        await this.otherButton.click();
    }

    async selectAreaAndContinue(areaCode: string) {
        logStep(`Selecting area and continuing: ${areaCode}`);
        await this.selectArea(areaCode);
        await this.saveAndContinue();
    }
}

export default new CatchAreaPage();
