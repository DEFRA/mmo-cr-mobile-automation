import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class SubmissionNudgePage extends BaseCatchRecordPage {
    protected pageId = 'submissionNudge';

    get submissionWindowMessage() {
        return $('~Catch records must be submitted within 24 hours of a trip ending.');
    }

    get checkDateLink() {
        return $('~CatchRecord.submissionNudge.checkDateLink');
    }
    async checkTripEndDate() {
        logStep('checkTripEndDate');
        await this.checkDateLink.click();
    }
}

export default new SubmissionNudgePage();
