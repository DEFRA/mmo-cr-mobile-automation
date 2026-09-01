import { BasePage } from './basePage';

export class BaseCatchRecordPage extends BasePage {
    get backButton() {
        return this.selector('ViewHeader.backButton');
    }

    get branding() {
        return this.selector('ViewHeader.branding');
    }

    get newCatchRecordHeading() {
        return this.selector('New catch record');
    }
}
