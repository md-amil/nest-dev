import apm from 'elastic-apm-node';
import { env, apmServer } from 'src/config/app';
export function initialize() {
  console.log({ apmServer, env });
  if (env === 'local' || !apmServer) {
    return;
  }
  apm.start({
    logUncaughtExceptions: true,
    errorOnAbortedRequests: true,
    captureErrorLogStackTraces: 'always',
    serviceName: 'wp-cms',
    captureBody: 'all',
    captureHeaders: true,
    serviceNodeName: 'wp-cms',
    environment: env,
    serverUrl: apmServer,
  });
}
