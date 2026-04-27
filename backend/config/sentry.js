import * as Sentry from '@sentry/node';

let sentryEnabled = false;

export const initSentry = () => {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return false;

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
  });

  sentryEnabled = true;
  return true;
};

export const captureBackendException = (err, req, extras = {}) => {
  if (!sentryEnabled) return;

  Sentry.withScope((scope) => {
    scope.setTag('service', 'backend-api');

    if (req) {
      scope.setContext('request', {
        method: req.method,
        path: req.originalUrl,
        statusCode: req.res?.statusCode,
      });

      if (req.user?._id) {
        scope.setUser({ id: req.user._id.toString() });
      }
    }

    Object.entries(extras).forEach(([key, value]) => {
      if (value !== undefined) {
        scope.setExtra(key, value);
      }
    });

    Sentry.captureException(err);
  });
};
