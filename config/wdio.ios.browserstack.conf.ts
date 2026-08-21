import { baseConfig, cleanReports, mergeCommonCapabilities } from './wdio.base.conf';

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
                deviceName: 'iPhone 17 Pro Max',
                osVersion: '26',
                realMobile: true,
            },
        },
        {
            platformName: 'iOS',
            'appium:automationName': 'XCUITest',
            'bstack:options': {
                deviceName: 'iPhone 17 Pro',
                osVersion: '26',
                realMobile: true,
            },
        },
    ],

    maxInstances: 10,

    onPrepare: () => {
        cleanReports();
    },

    specs: ['../test/ios/specs/**/*.spec.ts'],

    connectionRetryTimeout: 90000,
};

mergeCommonCapabilities(config, {
    'appium:options': {
        orientation: 'PORTRAIT',
    },
    'bstack:options': {
        projectName: 'iOS Appium WDIO',
        buildName: 'browserstack build',
        sessionName: 'WDIO iOS Appium Tests',
        debug: true,
        networkLogs: true,
    },
});
