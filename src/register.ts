import dotenv from 'dotenv';
const env = process.env.APP_ENV ?? 'development';
const envFiles = [`.env.${env}.local`, `.env.${env}`, '.env'];
envFiles.forEach((x) => {
  const isLoaded = dotenv.config({
    path: x,
  });
  if (isLoaded.parsed) {
    console.log('Loaded env file: ', x);
  }
});
