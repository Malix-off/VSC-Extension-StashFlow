import { defineConfig } from 'vite'

export default defineConfig({
	publicDir: false,
	build: {
		rollupOptions: {
			input: 'src/main.ts',
			external: ['vscode'],
			output: {
				entryFileNames: 'main.js',
			}
		}
	}
});
