import { BaseCatchRecordPage } from './baseCatchRecordPage';

export class ConfirmSamePortPage extends BaseCatchRecordPage {
    protected pageId = 'confirmSamePort';

    headingForPort(portName: string) {
        return $(
            `//XCUIElementTypeStaticText[@name="CatchRecord.confirmSamePort.heading" and @value="Was ${portName} your departure and return port?"]`,
        );
    }

    get description() {
        return $(
            '~Select yes if you left from and returned to the same port. Select no if you used a different port for departure and return.',
        );
    }

    get radioGroup() {
        return $('~CatchRecord.confirmSamePort.radioGroup');
    }

    get yesOption() {
        return $('~CatchRecord.confirmSamePort.option.yes');
    }

    get noOption() {
        return $('~CatchRecord.confirmSamePort.option.no');
    }

    get validationError() {
        return $('~CatchRecord.confirmSamePort.error');
    }

    get addAnotherPortButton() {
        return $('~CatchRecord.confirmSamePort.addAnother');
    }
}

export default new ConfirmSamePortPage();
