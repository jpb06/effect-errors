import { config } from 'dotenv-flow';

config({ silent: true });

export const prettyPrintEnabled =
  process.env.NODE_ENV === 'development' ||
  process.env.EFFECT_PRETTY_PRINT === 'true';
