import { logStep } from '../../common/logger';

export class NetworkHelper {
    static async goOffline() {
        await logStep('Going OFFLINE (Disabling all network connections)');
        // @ts-ignore
        if (typeof driver.setNetworkConnection === 'function') {
            await driver.setNetworkConnection(0 as any);
        } else {
            console.warn(
                'setNetworkConnection is not available on this driver. Ensure you are running on Android.',
            );
        }
    }

    static async goOnline() {
        await logStep('Going ONLINE (Enabling Wifi and Cellular Data)');
        // @ts-ignore
        if (typeof driver.setNetworkConnection === 'function') {
            await driver.setNetworkConnection(6 as any);
        }
    }

    static async enableAirplaneMode() {
        await logStep('Enabling Airplane Mode');
        // @ts-ignore
        if (typeof driver.setNetworkConnection === 'function') {
            await driver.setNetworkConnection(1 as any);
        }
    }
}

export default NetworkHelper;
