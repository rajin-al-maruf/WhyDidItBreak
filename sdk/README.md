# WhyDidItBreak Browser SDK

A JavaScript SDK for capturing browser errors.

## Usage

```js
import {
  init,
  startErrorListener,
  captureException,
  sendReport,
} from './src/index.js';

init({
  ingestionKey: 'YOUR_PROJECT_KEY',
  endpoint: 'http://localhost:5000/api/events',
  environment: 'development',
  captureStack: false,
  captureUrl: false,
  captureBrowser: false,
});

async function handleReport(report) {
  try {
    await sendReport(report);
  } catch {
    // Reporting must not break the application.
  }
}

const stopMonitoring = startErrorListener(handleReport);

// Report an error caught by application code:
try {
  throw new Error('Example error');
} catch (error) {
  captureException(error, handleReport);
}

// Call stopMonitoring() when automatic monitoring is no longer needed.
```

## Collection and privacy

- Captures error messages, timestamps and configured environment.
- Stack traces, page URL and browser information require opt-in.
- Page URLs exclude query strings and fragments.
- Basic redaction targets bearer tokens, common credential assignments
  and email addresses in messages and stacks.
- Redaction does not guarantee removal of all sensitive information.
- Does not collect request bodies, cookies or user identity.
- Reporting requests omit browser credentials.

## Manual checks completed

- Uncaught errors and unhandled promise rejections.
- Explicit capture of caught errors.
- Optional context collection and basic redaction.
- Removing automatic listeners.
- Failed delivery without breaking the demo.

## Current limitations

- Receiving API and database storage belong to FR-05.
- Successful end-to-end delivery has not been verified.
- Browser compatibility has not been broadly tested.
- Source-map support, retries and offline buffering are not implemented.