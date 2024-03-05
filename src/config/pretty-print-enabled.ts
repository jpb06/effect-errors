import { config } from 'dotenv-flow';

config();

export const prettyPrintEnabled =
  process.env.NODE_ENV === 'development' ||
  process.env.EFFECT_PRETTY_PRINT === 'true';
