import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class SubmissionNudgePage extends BaseCatchRecordPage {
    get referenceNumber() {
        return $('~CatchRecord.submissionNudge.referenceNumber');
    }

    get heading() {
        return $('~CatchRecord.submissionNudge.heading');
    }

    get submissionWindowMessage() {
        return $('~Catch records must be submitted within 24 hours of a trip ending.');
    }

    get checkDateLink() {
        return $('~CatchRecord.submissionNudge.checkDateLink');
    }

    get saveContinueButton() {
        return $('~CatchRecord.submissionNudge.saveContinue');
    }

    async checkTripEndDate() {
        await this.checkDateLink.click();
    }

    async continueToNextStep() {
        await this.saveContinueButton.click();
    }
}

export default new SubmissionNudgePage();
