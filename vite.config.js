import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
const page = path => fileURLToPath(new URL(path, import.meta.url));
export default defineConfig({build:{rollupOptions:{input:{main:page('./index.html'),zero:page('./historie/zero-camps/index.html'),cieplo:page('./historie/cieplo/index.html'),motto:page('./historie/w-dzialaniu/index.html'),nofollow:page('./nofollow/index.html'),privacy:page('./polityka-prywatnosci/index.html'),enMain:page('./en/index.html'),enZero:page('./en/historie/zero-camps/index.html'),enCieplo:page('./en/historie/cieplo/index.html'),enMotto:page('./en/historie/w-dzialaniu/index.html'),enNofollow:page('./en/nofollow/index.html'),enPrivacy:page('./en/polityka-prywatnosci/index.html')}}}});
