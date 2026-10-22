let config = null;

export function init(options = {}) {
  if (
    !options ||
    typeof options.ingestionKey !== 'string' ||
    !options.ingestionKey.trim() ||
    typeof options.endpoint !== 'string' ||
    !options.endpoint.trim()
  ) {
    return false;
  }

  config = {
    ingestionKey: options.ingestionKey.trim(),
    endpoint: options.endpoint.trim(),
    environment: typeof options.environment === 'string' ? options.environment : 'development',
    captureStack: options.captureStack === true,
    captureUrl: options.captureUrl === true,
    captureBrowser: options.captureBrowser === true,
  };

  return true;
}

  function reportError(message, error, onReport) {
    try {
      const report = {
        message: redactText(message).slice(0, 500),
        timestamp: new Date().toISOString(),
        environment: config?.environment || 'development',
      };

      if (config?.captureStack && typeof error?.stack === 'string') {
        report.stack = redactText(error.stack).slice(0, 2000);
      }

      if (config?.captureUrl) {
        report.url = (
          window.location.origin + window.location.pathname
        ).slice(0, 500);
      }

      if (config?.captureBrowser) {
        report.browser = navigator.userAgent.slice(0, 300);
      }

      Promise.resolve(onReport(report)).catch(function () {
        // Ignore asynchronous failures in the reporting callback.
      });
    } catch {
      // Monitoring must not cause another uncaught error.
    }
  }

export function startErrorListener(onReport) {

  function handleError(event) {
    reportError(event.message, event.error, onReport);
  }

  function handleRejection(event) {
    const reason = event.reason;

    const message =
      reason instanceof Error
        ? reason.message
        : typeof reason === 'string'
          ? reason
          : 'Unhandled promise rejection';

    reportError(message, reason, onReport);
  }

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);

  return function stopListening() {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleRejection);
  };
}

export function captureException(error, onReport) {
  try {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Unknown error';

    reportError(message, error, onReport);
  } catch {
    // Reporting must not break the application.
  }
}

function redactText(text) {
  return text
    .replace(/\bBearer\s+\S+/gi, 'Bearer [REDACTED]')
    .replace(
      /\b(password|token|api[_-]?key|secret)\s*[:=]\s*\S+/gi,
      '$1=[REDACTED]'
    )
    .replace(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
      '[EMAIL]'
    );
}

export async function sendReport(report) {
  try {
    if (!config) return false;

    const payload = {
      ingestionKey: config.ingestionKey,
      message: report.message,
      timestamp: report.timestamp,
      environment: report.environment,
      stack: report.stack,
      url: report.url,
      browser: report.browser,
    };

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch {
    return false;
  }
}
