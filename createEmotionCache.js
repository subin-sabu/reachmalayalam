// createEmotionCache.js

import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// On the client side, create a new cache
const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
};

export default createEmotionCache;
