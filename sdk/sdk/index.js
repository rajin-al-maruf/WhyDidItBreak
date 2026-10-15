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
    environment: typeof options.environment === 'string' ? options.environment : 'development'
  };

  return true;
}