// styles/fonts.js

import { Noto_Sans_Malayalam } from 'next/font/google';

const notoSansMalayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam', 'latin', 'latin-ext'],
  weight: ['100', '200','300', '400', '500', '600','700', '800', '900'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: 'Arial',
  variable: '--font-noto-sans-malayalam',
});

export { notoSansMalayalam };
