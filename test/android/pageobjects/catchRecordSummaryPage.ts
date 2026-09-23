import { BasePage } from './basePage';

export class CatchRecordSummaryPage extends BasePage {
    get heading() {
        return $('//android.widget.TextView[@text="Check your catch record" and @heading="true"]');
    }

    /**
     * Get the value element for a given summary field label.
     * @param label The exact label text (e.g., "Vessel", "Departure date", "Return port", "Gear type")
     */
    fieldValue(label: string) {
        return $(
            `//android.widget.TextView[@text="${label}"]/following-sibling::android.widget.TextView[1]`,
        );
    }

    /**
     * Get the 'Change' button for a given summary field label.
     * Utilizes the content-desc attribute which reliably maps to "Change <Label>".
     * @param label The exact label text (e.g., "Vessel", "Statistical sub area", "Mesh size (mm)")
     */
    changeButton(label: string) {
        return $(`//android.widget.Button[@content-desc="Change ${label}"]`);
    }

    get acceptAndSubmitButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="Accept and submit trip details"]]',
        );
    }

    // --- Actions ---

    /**
     * Reads the current recorded value for a summary field.
     */
    async getFieldValue(label: string): Promise<string> {
        const field = this.fieldValue(label);
        await field.waitForDisplayed({ timeout: 10000 });
        return field.getText();
    }

    /**
     * Clicks the change button next to a specific summary field.
     */
    async clickChangeForField(label: string) {
        const btn = this.changeButton(label);
        await btn.waitForDisplayed({ timeout: 10000 });
        await btn.click();
    }

    /**
     * Accepts the declaration and submits the trip details.
     */
    async acceptAndSubmit() {
        await this.acceptAndSubmitButton.waitForDisplayed({ timeout: 10000 });
        await this.acceptAndSubmitButton.click();
    }
}

export default new CatchRecordSummaryPage();
