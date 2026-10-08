import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

const API_BASE_URL = 'https://api-cloud.browserstack.com/app-automate';

export interface BrowserStackApp {
    app_name: string;
    app_version: string;
    app_url: string;
    app_id: string;
    uploaded_at: string;
    custom_id?: string;
    shareable_id?: string;
    bypass_secure_screen_restriction?: string;
}

export interface BrowserStackUploadOptions {
    customId?: string;
    iosKeychainSupport?: boolean;
}

export interface BrowserStackAppListOptions {
    limit?: number;
    offset?: number;
    customId?: string;
}

export class BrowserStackAppHelper {
    constructor(
        private readonly username = process.env.BROWSERSTACK_USERNAME,
        private readonly accessKey = process.env.BROWSERSTACK_ACCESS_KEY,
    ) {}

    async uploadAppFromFile(
        filePath: string,
        options: BrowserStackUploadOptions = {},
    ): Promise<{ app_url: string; custom_id?: string; shareable_id?: string }> {
        const file = await readFile(filePath);
        const form = new FormData();
        form.append('file', new Blob([new Uint8Array(file)]), basename(filePath));
        this.addUploadOptions(form, options);

        return this.request('/upload', {
            method: 'POST',
            body: form,
        });
    }

    async listApps(options: BrowserStackAppListOptions = {}): Promise<BrowserStackApp[]> {
        const query = this.buildListQuery(options);
        const customIdPath = options.customId ? `/${encodeURIComponent(options.customId)}` : '';
        const apps = await this.request<BrowserStackApp[] | { message: string }>(
            `/recent_apps${customIdPath}${query}`,
        );
        // BrowserStack returns { message: 'No results found' } instead of an empty array.
        return Array.isArray(apps) ? apps : [];
    }

    async deleteAppsByCustomId(customId: string): Promise<BrowserStackApp[]> {
        const apps = await this.listApps({ customId, limit: 100 });
        for (const app of apps) {
            await this.deleteApp(app.app_id);
        }
        return apps;
    }

    async deleteApp(appId: string): Promise<{ success: boolean }> {
        if (!appId.trim()) {
            throw new Error('BrowserStack app ID must not be empty.');
        }
        return this.request(`/app/delete/${encodeURIComponent(appId)}`, {
            method: 'DELETE',
        });
    }

    private addUploadOptions(form: FormData, options: BrowserStackUploadOptions): void {
        if (options.customId) {
            form.append('custom_id', options.customId);
        }
        if (options.iosKeychainSupport !== undefined) {
            form.append('ios_keychain_support', String(options.iosKeychainSupport));
        }
    }

    private buildListQuery(options: BrowserStackAppListOptions): string {
        const params = new URLSearchParams();
        if (options.limit !== undefined) {
            if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 100) {
                throw new Error('BrowserStack app list limit must be an integer from 1 to 100.');
            }
            params.set('limit', String(options.limit));
        }
        if (options.offset !== undefined) {
            if (!Number.isInteger(options.offset) || options.offset < 0) {
                throw new Error('BrowserStack app list offset must be a non-negative integer.');
            }
            params.set('offset', String(options.offset));
        }
        const query = params.toString();
        return query ? `?${query}` : '';
    }

    private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
        if (!this.username || !this.accessKey) {
            throw new Error(
                'BrowserStack API credentials are required. Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY.',
            );
        }

        const authorization = Buffer.from(`${this.username}:${this.accessKey}`).toString('base64');
        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...init,
            headers: {
                Accept: 'application/json',
                Authorization: `Basic ${authorization}`,
                ...init.headers,
            },
        });
        const responseBody = await response.text();

        if (!response.ok) {
            throw new Error(
                `BrowserStack App Automate API request failed (${response.status} ${response.statusText}): ${responseBody}`,
            );
        }

        try {
            return JSON.parse(responseBody) as T;
        } catch (error) {
            throw new Error('BrowserStack App Automate API returned invalid JSON.', {
                cause: error,
            });
        }
    }
}

export default BrowserStackAppHelper;
