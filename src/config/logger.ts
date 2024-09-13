export const endpoint = process.env.LOGGER_ENDPOINT;
export const source = process.env.LOGGER_SOURCE;
export const isEnabled = endpoint && source;
