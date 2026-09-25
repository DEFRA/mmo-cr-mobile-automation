import { baseConfig, cleanReports, mergeCommonCapabilities } from './wdio.base.conf';
import { logInfo } from '../test/common/logger';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    hostname: 'hub.browserstack.com',
    port: 443,

    services: [
        [
            'browserstack',
            {
                buildIdentifier: '${BUILD_NUMBER}',
                app: process.env.BROWSERSTACK_IOS_APP_URL,
                browserstackLocal: false,
            },
        ],
    ],

    capabilities: [
        {
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'bstack:options': {
                deviceName: 'iPhone 17',
                osVersion: '26',
                realMobile: true,
            },
        },
    ],

    maxInstances: 10,

    onPrepare: async () => {
        cleanReports();
        await logInfo('BrowserStack iOS session starting...');
    },

    specs: ['../test/ios/specs/**/*.spec.ts'],

    connectionRetryTimeout: 90000,
};

mergeCommonCapabilities(config, {
    'appium:options': {
        orientation: 'PORTRAIT',
        autoDismissAlerts: true,
    },
    'bstack:options': {
        projectName: 'iOS Appium WDIO',
        buildName: 'browserstack build',
        sessionName: 'WDIO iOS Appium Tests',
        debug: true,
        networkLogs: true,
    },
});
