import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	build: { commonjsOptions: { include: [] } },
	optimizeDeps: { disabled: false },
	plugins: [],
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './lib')
		}
	},
	test: {
		coverage: {
			provider: 'istanbul', // or 'c8'
			reporter: ['text', 'json', 'html', 'lcov']
		},
		globals: true,
		hookTimeout: 10000,
		include: ['lib/**/*.spec.ts'],

		testTimeout: 10000
	}
})
