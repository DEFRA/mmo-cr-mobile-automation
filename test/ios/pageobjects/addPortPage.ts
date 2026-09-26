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

    get validationError() {
        return $('~Select a port from the list');
    }

    portResult(portName: string) {
        return $(`~SearchDropdownField.result.${portName}`);
    }

    async enterPortSearch(term: string) {
        logStep('enterPortSearch');
        await this.searchField.setValue(term);
    }

    async searchAndSelectPort(searchTerm: string, portName: string) {
        logStep(`Searching for ${searchTerm} and selecting port ${portName}`);
        await this.searchAndSelect(this.searchField, searchTerm, this.portResult(portName));
    }

    async selectPort(portName: string, searchTerm?: string) {
        logStep('selectPort with port name: ' + portName);
        const term = searchTerm || portName.substring(0, 2);
        await this.searchAndSelectPort(term, portName);
    }
}

export default new AddPortPage();
