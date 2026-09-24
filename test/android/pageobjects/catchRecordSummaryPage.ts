import { BasePage } from './basePage';

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
        const field = this.fieldValue(label);
        await field.waitForDisplayed({ timeout: 10000 });
        return field.getText();
    }

    async clickChangeForField(label: string) {
        const btn = this.changeButton(label);
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }

    async acceptAndSubmit() {
        try {
            await this.acceptAndSubmitButton.waitForDisplayed({ timeout: 2000 });
        } catch (error) {
            // Scroll down if the element is not visible within 2 seconds
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollForward()');
            await this.acceptAndSubmitButton.waitForDisplayed({ timeout: 10000 });
        }
        await this.acceptAndSubmitButton.click();
    }
}

export default new CatchRecordSummaryPage();
