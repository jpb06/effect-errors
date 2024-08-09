import { spanAttributesMatcher } from './to-have-attributes.js';

const matchers = () => {
  Promise.all([spanAttributesMatcher()]);
};

(() => {
  matchers();
})();
