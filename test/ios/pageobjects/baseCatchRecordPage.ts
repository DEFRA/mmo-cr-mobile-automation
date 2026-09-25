import { BasePage } from './basePage';
import { logStep, logError } from '../../common/logger';

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

    protected async searchAndSelect(
        searchField: ReturnType<typeof $>,
        term: string,
        result: ReturnType<typeof $>,
    ) {
        logStep(`Searching for term "${term}" and selecting result`);
        await searchField.setValue(term);
        await result.waitForExist({ timeout: 10000 });
        await browser.execute('mobile: scrollToElement', {
            element: await result.elementId,
        });
        await result.waitForDisplayed({ timeout: 10000 });
        await result.click();
    }

    protected optionCandidates(prefix: string, name: string) {
        const normalized = name.toLowerCase();
        return [
            this.selector(`${prefix}.${normalized}`),
            this.selector(`${prefix}.${name}`),
            this.selector(name),
            this.selector(`${prefix}.${normalized.replace(/\s+/g, '')}`),
        ];
    }

    protected async clickFirstExisting(
        candidates: ReturnType<typeof $>[],
        notFoundMessage: string,
    ) {
        logStep('Attempting to click first existing candidate');
        for (const candidate of candidates) {
            if (await candidate.isExisting()) {
                logStep(`Found candidate and clicking it`);
                await candidate.click();
                return;
            }
        }

        logError(`BaseCatchRecordPage: Candidates not found. ${notFoundMessage}`);
        throw new Error(notFoundMessage);
    }
}
