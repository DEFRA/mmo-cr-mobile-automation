import { BasePage } from './basePage';
import { logStep } from '../../common/logger';

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

    async getRecordReference(): Promise<string> {
        logStep('Getting record reference');
        await this.referenceText.waitForDisplayed({ timeout: 10000 });
        const text = await this.referenceText.getText();

        const prefix = 'reference ';
        let reference = text;
        if (text.includes(prefix)) {
            reference = text.split(prefix)[1].trim();
        }
        logStep(`Record reference is ${reference}`);
        return reference;
    }

    async clickViewRecords() {
        logStep('Clicking view records');
        await this.viewRecordsButton.waitForDisplayed({ timeout: 10000 });
        await this.viewRecordsButton.click();
    }
}

export default new SubmissionSuccessPage();
