/**
 * Client for the proxy-controller sidecar (scripts/proxy-controller.ts).
 * Used by tests to simulate offline/online network conditions on the iOS Simulator.
 */

const apiPort = process.env.PROXY_API_PORT || '8081';
const baseUrl = `http://localhost:${apiPort}`;

interface ProxyStatus {
    blocking: boolean;
}

/** Simulates offline by blocking all traffic through the proxy. */
export async function simulateOffline(): Promise<void> {
    await postControl('/block');
}

/** Simulates online by allowing all traffic through the proxy. */
export async function simulateOnline(): Promise<void> {
    await postControl('/allow');
}

/** Returns whether the proxy is currently blocking traffic. */
export async function isOffline(): Promise<boolean> {
    const response = await fetch(`${baseUrl}/status`);
    if (!response.ok) {
        throw new Error(`Proxy status check failed: ${response.status} ${response.statusText}`);
    }
    const { blocking }: ProxyStatus = await response.json();
    return blocking;
}

async function postControl(path: '/block' | '/allow'): Promise<void> {
    const response = await fetch(`${baseUrl}${path}`, { method: 'POST' });
    if (!response.ok) {
        throw new Error(
            `Proxy request to ${path} failed: ${response.status} ${response.statusText}`,
        );
    }
}
