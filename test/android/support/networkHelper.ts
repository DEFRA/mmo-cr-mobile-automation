import { logStep } from './logger';

/**
 * Utility class to control the Android device's network state via Appium.
 *
 * Android Network Connection Types:
 * 0: None (Offline)
 * 1: Airplane Mode
 * 2: Wifi Only
 * 4: Data Only
 * 6: All Network On (Wifi + Data)
 */
export class NetworkHelper {
    /**
     * Completely disables all network connections (Wifi and Cellular Data).
     */
    static async goOffline() {
        await logStep('Going OFFLINE (Disabling all network connections)');
        // @ts-ignore
        if (typeof driver.setNetworkConnection === 'function') {
            await driver.setNetworkConnection({ type: 0 });
        } else {
            console.warn(
                'setNetworkConnection is not available on this driver. Ensure you are running on Android.',
            );
        }
    }

    /**
     * Fully enables all network connections (Wifi and Cellular Data).
     */
    static async goOnline() {
        await logStep('Going ONLINE (Enabling Wifi and Cellular Data)');
        // @ts-ignore
        if (typeof driver.setNetworkConnection === 'function') {
            await driver.setNetworkConnection({ type: 6 });
        }
    }

    /**
     * Toggles airplane mode specifically.
     */
    static async enableAirplaneMode() {
        await logStep('Enabling Airplane Mode');
        // @ts-ignore
        if (typeof driver.setNetworkConnection === 'function') {
            await driver.setNetworkConnection({ type: 1 });
        }
    }
}

export default NetworkHelper;
