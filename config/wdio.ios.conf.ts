import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { appiumPort, baseConfig, cleanReports, uninstallIosApp } from './wdio.base.conf';

const appsDir = join(process.cwd(), 'apps');
const appFile = existsSync(appsDir)
    ? readdirSync(appsDir).find((file) => file.endsWith('.ipa') || file.endsWith('.app'))
    : undefined;
const iosDeviceName = process.env.IOS_DEVICE_NAME;
const iosPlatformVersion = process.env.IOS_PLATFORM_VERSION;
const iosUdid = process.env.IOS_UDID;
const iosBundleId = process.env.IOS_BUNDLE_ID;
const noReset = process.env.APPIUM_NO_RESET === 'true';

if (!appFile) {
    throw new Error(
        'No .ipa or .app found in ./apps. Place the Record Your Catch IPA/app bundle in the ./apps folder.',
    );
}

export const config: WebdriverIO.Config = {
    ...baseConfig,

    capabilities: [
        {
            platformName: 'iOS',
            'wdio:maxInstances': 1,
            'appium:automationName': 'XCUITest',
            ...(iosDeviceName ? { 'appium:deviceName': iosDeviceName } : {}),
            ...(iosPlatformVersion ? { 'appium:platformVersion': iosPlatformVersion } : {}),
            ...(iosUdid ? { 'appium:udid': iosUdid } : {}),
            'appium:app': join(appsDir, appFile),
            'appium:orientation': 'PORTRAIT',
            'appium:noReset': noReset,
            'appium:newCommandTimeout': 240,
        },
    ],

    specs: ['../test/ios/specs/**/*.spec.ts'],

    runner: 'local',
    bail: 0,
    connectionRetryTimeout: 120000,

    onPrepare: async () => {
        cleanReports();
        if (iosBundleId) {
            await uninstallIosApp(iosBundleId, iosUdid);
        }
    },

    services: [
        [
            'appium',
            {
                command: 'appium',
                args: {
                    port: appiumPort,
                    relaxedSecurity: true,
                    log: './logs/appium-ios.log',
                },
            },
        ],
    ],
};
