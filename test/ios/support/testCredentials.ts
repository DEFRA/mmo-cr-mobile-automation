import { logInfo } from '../../common/logger';
export function getIosTestCredentials(): { email: string; password: string } {
    logInfo('Loading iOS test credentials');
    const email = process.env.IOS_TEST_EMAIL;
    const password = process.env.IOS_TEST_PASSWORD;

    if (!email || !password) {
        throw new Error(
            'IOS_TEST_EMAIL and IOS_TEST_PASSWORD must be set in .env to run this test.',
        );
    }

    return { email, password };
}
