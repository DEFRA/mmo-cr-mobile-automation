import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class SubmissionSuccessPage extends BaseCatchRecordPage {
    get panel() {
        return $('~CatchRecord.submissionSuccess.panel');
    }

    get submissionMessage() {
        return $('~Your catch record has been submitted');
    }

    get referenceLabel() {
        return $('~Your catch record reference');
    }

    getReferenceNumber(value: string) {
        return this.selector(value);
    }

    get whatHappensNextHeading() {
        return $('~CatchRecord.submissionSuccess.whatHappensNextHeading');
    }

    get bulletList() {
        return $('~CatchRecord.submissionSuccess.bulletList');
    }

    get receivedByAuthorityText() {
        return $('~Your catch record has been received by the relevant fishing authority');
    }

    get confirmationEmailText() {
        return $("~You'll receive a confirmation email within 24 hours");
    }

    get viewRecordsText() {
        return $('~You can view your submitted records in your account at any time');
    }

    get saveReferenceText() {
        return $('~Save your catch record reference for your records');
    }

    get viewRecordsButton() {
        return $('~CatchRecord.submissionSuccess.viewRecords');
    }

    async viewYourCatchRecords() {
        logStep('viewYourCatchRecords');
        await this.viewRecordsButton.click();
    }
}

export default new SubmissionSuccessPage();
