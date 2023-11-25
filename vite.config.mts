import { defineConfig } from 'vite'

export default defineConfig({
	publicDir: false,
	build: {
		lib: {
			entry: './src/main.ts',
			formats: ['cjs'],
			fileName: 'main',
		},
		rollupOptions: {
			external: ['vscode'],
		},
		sourcemap: true,
	},
});
