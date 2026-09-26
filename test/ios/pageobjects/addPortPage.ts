import { BaseCatchRecordPage } from './baseCatchRecordPage';
import { logStep } from '../../common/logger';

export class AddPortPage extends BaseCatchRecordPage {
    protected pageId = 'addPort';

    get emptyStateText() {
        return $(
            '~No ports added yet. Enter a port name or the nearest port to where you left and will return.',
        );
    }

    get searchLabel() {
        return $('//XCUIElementTypeStaticText[starts-with(@value, "Add port to vessel ")][last()]');
    }

    get searchField() {
        return $(
            '//XCUIElementTypeTextField[@placeholderValue="Type to search (minimum 2 characters)"]',
        );
    }
    portResult(portName: string) {
        return $(`~SearchDropdownField.result.${portName}`);
    }

    async enterPortSearch(term: string) {
        logStep('enterPortSearch');
        await this.searchField.setValue(term);
    }

    async selectPort(portName: string) {
        logStep('selectPort with port name: ' + portName);
        await this.searchAndSelect(this.searchField, portName, this.portResult(portName));
    }
}

export default new AddPortPage();
