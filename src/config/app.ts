export const env = process.env.APP_ENV ?? 'development';
export const nodeEnv = process.env.NODE_ENV;
export const apmServer = process.env.APM_SERVER;
export const themeContentWidth = parseInt(
  process.env.THEME_CONTENT_WIDTH ?? '640',
); // WordPress Theme Content Width
export const noFollowRedirectionStatusCode = 319; // Custom redirection response so front-end does not follow the url automatically.
export const allowedLocales = new Set(['en_IN', 'hi_IN']);