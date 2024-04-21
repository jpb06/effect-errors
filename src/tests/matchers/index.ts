import { chalkMatcher } from './to-chalk-match';
import { spanAttributesMatcher } from './to-have-attributes';

const matchers = () => {
  void Promise.all([chalkMatcher(), spanAttributesMatcher()]);
};

(() => {
  matchers();
})();
