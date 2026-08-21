# Record Your Catch — Appium Test Automation

A TypeScript test automation project for the **Record Your Catch** Android & iOS app using
[WebdriverIO](https://webdriver.io) v9, [Appium](https://appium.io) 3, Mocha, Allure,
and the Page Object Model pattern.

## One-Time Machine Setup (macOS)

1. Install [Homebrew](https://brew.sh) if you don't have it:

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

2. Install Node.js 24 LTS:

    ```bash
    brew install node@24
    ```

3. Install Java JDK 17 and set `JAVA_HOME`:

    ```bash
    brew install --cask temurin@17
    ```

    Add to your `~/.zshrc`:

    ```bash
    export JAVA_HOME=$(/usr/libexec/java_home -v 17)
    ```

4. Install Xcode from the Mac App Store, then install command-line tools:

    ```bash
    xcode-select --install
    ```

    Accept the Xcode license:

    ```bash
    sudo xcodebuild -license accept
    ```

5. Install Android SDK via Android Studio:

    ```bash
    brew install --cask android-studio
    ```

    After installation, open Android Studio and install Android SDK via **Settings → Languages & Frameworks → Android SDK**.

    Add to your `~/.zshrc`:

    ```bash
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin
    ```

    Reload your shell:

    ```bash
    source ~/.zshrc
    ```

6. Install Appium and drivers:

    ```bash
    npm install -g appium
    appium driver install uiautomator2
    appium driver install xcuitest
    ```

7. For Android, enable Developer options and USB debugging on your device, then confirm it is visible:

    ```bash
    adb devices -l
    ```

8. For iOS, verify available simulators:

    ```bash
    xcrun simctl list devices available
    ```

    For real iOS devices, ensure the device is connected and trusted.

## Project Setup

Install dependencies:

```bash
npm install
```

Place the app builds in the `apps/` folder:

- Android: place the `.apk` file.
- iOS: place the `.ipa` file (real device) or `.app` file (simulator).

Create a local `.env` from `.env.example` when you need credentials or machine-specific settings:

```bash
cp .env.example .env
```

Useful local variables:

- `ANDROID_APP_ID`: Android app package id, defaults to `com.recordyourcatch.app`.
- `ANDROID_UDID`: optional Android device serial from `adb devices -l`.
- `IOS_BUNDLE_ID`: iOS app bundle id.
- `IOS_DEVICE_NAME`: simulator/device name, defaults to `iPhone 16`.
- `IOS_PLATFORM_VERSION`: iOS version, defaults to `18.0`.
- `IOS_UDID`: optional iOS real-device UDID.
- `APPIUM_NO_RESET`: set to `true` only when you intentionally want to preserve app state.
- `APPIUM_PORT`: local Appium server port, defaults to `4723`. `@wdio/appium-service` starts the server on this port before the suite runs and kills it once the suite completes.

## Project Structure

- `config/`: shared, local, and BrowserStack WDIO configs.
- `test/common/commonBasePage.ts`: shared `CommonBasePage` with cross-platform actions (app lifecycle, navigation, alerts, context switching).
- `test/android/pageobjects/`: Android screen objects, extending the common base page.
- `test/android/specs/`: Android Mocha specs.
- `test/ios/pageobjects/`: iOS screen objects, extending the common base page.
- `test/ios/specs/`: iOS Mocha specs.

## Run Tests

Android:

```bash
npm run test:android
```

iOS:

```bash
npm run test:ios
```

Run against BrowserStack:

```bash
npm run test:android:browserstack
npm run test:ios:browserstack
```

## GitHub Actions

The `Android E2E` and `iOS E2E` workflows run independently against BrowserStack. Add these
repository secrets before running them:

- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`
- `BROWSERSTACK_ANDROID_APP_URL`
- `BROWSERSTACK_IOS_APP_URL`

Both workflows are started manually from the Actions tab.

The `Pull Request Checks` workflow runs automatically for pull requests targeting `main` and
checks dependencies, TypeScript, and formatting on every pull request update. Configure this
workflow as a required status check in the branch protection rules for `main` to block merges
until it passes.

Quality checks:

```bash
npm run format:check
npm run typecheck
```

Generate an Allure report after a run:

```bash
npm run report
```

## Adding New Tests

1. Create a page object in `test/android/pageobjects/` or `test/ios/pageobjects/` extending the platform `BasePage`, which in turn extends `test/common/commonBasePage.ts`'s `CommonBasePage` for shared actions.
2. Add element getters using accessibility ids or XPath selectors.
3. Write action methods that encapsulate screen interactions.
4. Create a spec file in `test/android/specs/` or `test/ios/specs/` using Mocha BDD syntax.
5. Use Appium Inspector to find stable accessibility ids and resource ids.

## Platform Notes

- Android uses UiAutomator2 `mobile: *Gesture` execute methods (`swipeGesture`, `scrollGesture`) for swipe/scroll actions.
- iOS uses XCUITest execute methods instead, which have different names and parameters: `mobile: swipe` (direction-based), `mobile: scrollToElement` (scrolls until an element is visible), and `mobile: dragFromToForDuration` (coordinate-based drag). Check the installed driver's `execute-method-map.js` before assuming a command name carries over between platforms.
- iOS text fields and native pickers (e.g. the Forms screen dropdown) can be flaky under WDA; the corresponding iOS page object methods include small retry loops to compensate.
