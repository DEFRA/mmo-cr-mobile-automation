/** Reads and validates the Android test credentials from the environment. */
export function getAndroidTestCredentials(): { email: string; password: string } {
    const email = process.env.ANDROID_TEST_EMAIL || 'test@example.com';
    const password = process.env.ANDROID_TEST_PASSWORD || 'password123';

    return { email, password };
}
