import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env': { ...env, NODE_ENV: mode }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      // Configure jsdom environment
      environmentOptions: {
        jsdom: {
          url: 'http://localhost',
          resources: 'usable',
          runScripts: 'dangerously',
        },
      },
      // Ensure path aliases work in tests
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          '**/*.d.ts',
          '**/*.test.{ts,tsx}',
          '**/test-utils/**',
          '**/__mocks__/**',
        ],
      },
      // This helps with module resolution in tests
      deps: {
        inline: ['@testing-library/user-event'],
        fallbackCJS: true
      },
      // Ensure environment variables are loaded for tests
      env: {
        ...env,
        NODE_ENV: 'test',
      },
      // Add test timeout
      testTimeout: 10000,
      // Enable threads for faster test execution
      threads: true,
    },
  };
});
