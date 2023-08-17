import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { UserConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import tsconfigPaths from 'vite-tsconfig-paths';

import { generateManifest } from './scripts/generate-manifest';

const { version: _version } = readJsonFile('package.json');

const IS_PUBLISHING = !!process.env.IS_PUBLISHING;
const BRANCH = process.env.GITHUB_REF;

const MAIN_BRANCH = 'refs/heads/main';

// For non main branch builds, add a random number
const getVersionWithRandomSuffix = ref => {
  if (ref === MAIN_BRANCH || !ref || IS_PUBLISHING) return _version;
  return `${_version}.${Math.floor(Math.floor(Math.random() * 1000))}`;
};
const VERSION = getVersionWithRandomSuffix(BRANCH);

const config: UserConfig = {
  build: {
    // TODO: Confirm - the extension is only supported on latest versions of major browsers.
    target: 'esnext',
  },
  plugins: [
    react(),

    // Loads path aliases from tsconfig to correctly resolve import paths.
    tsconfigPaths(),

    // Provides polyfills for Node.js functionality used by some dependencies
    // which is not available in browser contexts.
    nodePolyfills(),

    // Handles WASM imports. Currently, Vite does not natively support WASM, yet
    // it is being imported by at least one dependency:
    // `node_modules/dlc-wasm-wallet/dlc_wasm_wallet_bg.wasm` is imported by
    // `node_modules/dlc-wasm-wallet/index.js`.
    //
    // See https://vitejs.dev/guide/features.html#webassembly
    wasm(),

    webExtension({
      manifest: () => generateManifest(VERSION),
      webExtConfig: {
        // TODO - Document how to configure this
        chromiumBinary: '/usr/bin/brave-browser',
      },
    }),
  ],
  resolve: {
    alias: {
      // Needed by the `vite-plugin-web-extension` plugin.
      // See https://github.com/aklinker1/vite-plugin-web-extension/issues/84#issuecomment-1471196461
      // In dev mode, make sure fast refresh works
      '/@react-refresh': path.resolve('node_modules/@vitejs/plugin-react-swc/refresh-runtime.js'),
    },
  },
};

export default config;
