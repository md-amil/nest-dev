export const enabled = process.env.CACHE !== 'false';
export const ttl = Number(process.env.CACHE_TTL || 0);
export const size = 300;
