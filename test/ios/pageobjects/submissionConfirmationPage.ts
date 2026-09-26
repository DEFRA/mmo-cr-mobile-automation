import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class SubmissionConfirmationPage extends BaseCatchRecordPage {
    protected pageId = 'submissionConfirmation';

    get notice() {
        return $('~CatchRecord.submissionConfirmation.notice');
    }

    get submissionStatement() {
        return $("~By submitting your catch record, you're confirming");
    }

    get bulletList() {
        return $('~CatchRecord.submissionConfirmation.bulletList');
    }

    get landedWeightAccuracyText() {
        return $('~The weight of fish you have landed is accurate');
    }

    get permittedToleranceText() {
        return $('~This is within permitted tolerance levels');
    }

    get inaccurateRecordingActionText() {
        return $('~Fishing authorities may take action in respect of inaccurate catch recording');
    }

    get confirmGroup() {
        return $('~CatchRecord.submissionConfirmation.confirmGroup');
    }

    get confirmCheckbox() {
        return $('~CatchRecord.submissionConfirmation.confirmCheckbox');
    }

    get validationError() {
        return $('~CatchRecord.submissionConfirmation.error');
    }

    get acceptButton() {
        return $('~CatchRecord.submissionConfirmation.accept');
    }

    async confirmSubmission() {
        logStep('confirmSubmission');
        await this.confirmCheckbox.click();
    }

    async acceptAndSubmit() {
        logStep('acceptAndSubmit');
        await this.scrollAndClickIfExisting(this.acceptButton);
    }
}

export default new SubmissionConfirmationPage();
