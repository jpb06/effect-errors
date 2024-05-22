import { chalkMatcher } from './to-chalk-match.js';
import { spanAttributesMatcher } from './to-have-attributes.js';

const matchers = () => {
  void Promise.all([chalkMatcher(), spanAttributesMatcher()]);
};

(() => {
  matchers();
})();
