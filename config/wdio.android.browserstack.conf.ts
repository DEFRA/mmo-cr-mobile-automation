import { baseConfig, cleanReports, mergeCommonCapabilities } from './wdio.base.conf';
import { logInfo } from '../test/common/logger';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    hostname: 'hub.browserstack.com',

    services: [
        [
            'browserstack',
            {
                buildIdentifier: '${BUILD_NUMBER}',
                app: process.env.BROWSERSTACK_ANDROID_APP_URL,
                browserstackLocal: false,
            },
        ],
    ],

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'bstack:options': {
                deviceName: 'Samsung Galaxy S26 Ultra',
                osVersion: '16.0',
                realMobile: true,
            },
        },
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'bstack:options': {
                deviceName: 'Samsung Galaxy S24',
                osVersion: '16.0',
                realMobile: true,
            },
        },
    ],

    maxInstances: 10,

    onPrepare: async () => {
        cleanReports();
        await logInfo('BrowserStack Android session starting...');
    },

    specs: ['../test/android/specs/**/*.spec.ts'],

    connectionRetryTimeout: 90000,
};

mergeCommonCapabilities(config, {
    'appium:options': {
        orientation: 'PORTRAIT',
    },
    'bstack:options': {
        projectName: 'mmo-cr-mobile-automation',
        buildName: 'Android Catch Recording',
        sessionName: 'Android E2E Tests',
        debug: true,
        networkLogs: true,
    },
});
