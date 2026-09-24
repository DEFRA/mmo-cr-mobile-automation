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

    protected async searchAndSelect(
        searchField: ReturnType<typeof $>,
        term: string,
        result: ReturnType<typeof $>,
    ) {
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
        for (const candidate of candidates) {
            if (await candidate.isExisting()) {
                await candidate.click();
                return;
            }
        }

        throw new Error(notFoundMessage);
    }
}
