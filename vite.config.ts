import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { UserConfig } from 'vite';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import tsconfigPaths from 'vite-tsconfig-paths';

import { generateManifest } from './scripts/generate-manifest';

const { version: _version } = readJsonFile('package.json');

const SRC_ROOT_PATH = path.join(__dirname, '../', 'src');
const DIST_ROOT_PATH = path.join(__dirname, '../', 'dist');

const WALLET_ENVIRONMENT = process.env.WALLET_ENVIRONMENT || 'development';
const ANALYZE_BUNDLE = process.env.ANALYZE === 'true';
const IS_PUBLISHING = !!process.env.IS_PUBLISHING;
const BRANCH = process.env.GITHUB_REF;

const IS_DEV = WALLET_ENVIRONMENT === 'development';
const IS_PROD = !IS_DEV;
const MAIN_BRANCH = 'refs/heads/main';

// For non main branch builds, add a random number
const getVersionWithRandomSuffix = ref => {
  if (ref === MAIN_BRANCH || !ref || IS_PUBLISHING) return _version;
  return `${_version}.${Math.floor(Math.floor(Math.random() * 1000))}`;
};
const VERSION = getVersionWithRandomSuffix(BRANCH);

const config: UserConfig = {
  build: {
    rollupOptions: {
      input: {
        background: 'src/background/background.ts',
        inpage: 'src/inpage/inpage.ts',
        'content-script': 'src/content-scripts/content-script.ts',
        index: 'src/app/index.tsx',
        'decryption-worker': 'src/shared/workers/decryption-worker.ts',
        debug: 'debug/debug.js',
      },
      output: {
        // entryFileNames: '[name].js', // TODO: is this necessary? What are Vite's defaults.
        // dir: 'dist', // TODO: is this necessary? What's the default? I believe Vite already sets this as a default.
        // chunkFileNames: IS_DEV ? '[name].chunk.js' : '[name].[hash].js',

        // TODO: should probably document why this was chosen rather than the default
        // https://rollupjs.org/configuration-options/#output-assetfilenames
        assetFileNames: '[name].[ext]',
      },
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    webExtension({
      manifest: generateManifest(VERSION),
    }),
  ],
};

export default config;
