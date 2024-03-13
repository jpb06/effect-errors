import { chalkMatcher } from './to-chalk-match';

const matchers = () => {
  Promise.all([chalkMatcher()]);
};

(() => {
  matchers();
})();
