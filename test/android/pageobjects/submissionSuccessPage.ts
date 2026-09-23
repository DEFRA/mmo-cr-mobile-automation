import { BasePage } from './basePage';

export class SubmissionSuccessPage extends BasePage {
    get heading() {
        return $(
            '//android.widget.TextView[@text="Your catch record has been submitted" and @heading="true"]',
        );
    }

    get referenceText() {
        return $('//android.widget.TextView[contains(@text, "Your catch record reference")]');
    }

    get viewRecordsButton() {
        return $(
            '//android.view.View[@clickable="true"][.//android.widget.TextView[@text="View your catch records"]]',
        );
    }

    // --- Actions ---

    /**
     * Extracts and returns the generated catch record reference ID.
     * Example text: "Your catch record reference A1234520260923134524"
     */
    async getRecordReference(): Promise<string> {
        await this.referenceText.waitForDisplayed({ timeout: 10000 });
        const text = await this.referenceText.getText();

        const prefix = 'reference ';
        if (text.includes(prefix)) {
            return text.split(prefix)[1].trim();
        }
        return text;
    }

    /**
     * Clicks the button to return to the list of catch records.
     */
    async clickViewRecords() {
        await this.viewRecordsButton.waitForDisplayed({ timeout: 10000 });
        await this.viewRecordsButton.click();
    }
}

export default new SubmissionSuccessPage();
