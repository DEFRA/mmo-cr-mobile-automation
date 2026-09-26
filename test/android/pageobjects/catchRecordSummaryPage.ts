import { BasePage } from './basePage';
import { logStep, logWarn } from '../../common/logger';

export class CatchRecordSummaryPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="Check your catch record" and @heading="true"]');
    }

    fieldValue(label: string) {
        return $(
            `//android.widget.TextView[@text="${label}"]/following-sibling::android.widget.TextView[1]`,
        );
    }

    changeButton(label: string) {
        return $(`//android.widget.Button[@content-desc="Change ${label}"]`);
    }

    get acceptAndSubmitButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Accept and submit trip details"]]',
        );
    }

    async getFieldValue(label: string): Promise<string> {
        logStep(`Getting field value for ${label}`);
        const field = this.fieldValue(label);
        await field.waitForDisplayed({ timeout: 10000 });
        return field.getText();
    }

    async clickChangeForField(label: string) {
        logStep(`Clicking change for field ${label}`);
        const btn = this.changeButton(label);
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }

    async acceptAndSubmit() {
        logStep('Clicking accept and submit');
        try {
            await this.acceptAndSubmitButton.waitForDisplayed({ timeout: 2000 });
        } catch (error) {
            logWarn('CatchRecordSummaryPage: Accept and submit button not visible, scrolling');
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollForward()');
            await this.acceptAndSubmitButton.waitForDisplayed({ timeout: 10000 });
        }
        await this.acceptAndSubmitButton.click();
    }
}

export default new CatchRecordSummaryPage();
