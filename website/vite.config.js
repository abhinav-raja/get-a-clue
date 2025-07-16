import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import fs from 'fs';
import path from 'path';

const toolHtmlDir = path.resolve('tools');
const toolHtmlFiles = fs
  .readdirSync(toolHtmlDir)
  .filter(f => f.endsWith('.html'))
  .reduce((entries, file) => {
    const name = path.basename(file, '.html');
    entries[`tools/${name}`] = path.resolve(toolHtmlDir, file);
    return entries;
  }, {});

export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve('index.html'),
        ...toolHtmlFiles
      }
    }
  }
});