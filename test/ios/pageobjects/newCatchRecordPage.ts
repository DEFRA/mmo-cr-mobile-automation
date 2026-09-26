import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class NewCatchRecordPage extends BaseCatchRecordPage {
    protected pageId = 'draftAction';

    get questionText() {
        return $('~What do you want to do with your draft record?');
    }

    get radioGroup() {
        return $('~CatchRecord.draftAction.radioGroup');
    }

    get completeThisRecordOption() {
        return $('~CatchRecord.draftAction.option.complete');
    }

    get deleteThisRecordOption() {
        return $('~CatchRecord.draftAction.option.delete');
    }
    get deleteConfirmationSheet() {
        return $('~Delete this draft record?');
    }

    get deleteConfirmationText() {
        return $('~This cannot be undone.');
    }

    get deleteConfirmButton() {
        return $('~CatchRecord.draftAction.deleteConfirm');
    }

    async chooseCompleteThisRecord() {
        logStep('chooseCompleteThisRecord');
        await this.completeThisRecordOption.click();
        await this.saveContinueButton.click();
    }

    async chooseDeleteThisRecord() {
        logStep('chooseDeleteThisRecord');
        await this.deleteThisRecordOption.click();
        await this.saveContinueButton.click();
    }

    async confirmDeleteDraftRecord() {
        logStep('confirmDeleteDraftRecord');
        await this.deleteConfirmationSheet.waitForDisplayed({ timeout: 10000 });
        await this.deleteConfirmationText.waitForDisplayed({ timeout: 10000 });
        await this.deleteConfirmButton.click();
    }
}

export default new NewCatchRecordPage();
