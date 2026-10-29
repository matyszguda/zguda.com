import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
const page = path => fileURLToPath(new URL(path, import.meta.url));
export default defineConfig({build:{rollupOptions:{input:{main:page('./index.html'),zero:page('./historie/zero-camps/index.html'),cieplo:page('./historie/cieplo/index.html'),motto:page('./historie/w-dzialaniu/index.html')}}}});
