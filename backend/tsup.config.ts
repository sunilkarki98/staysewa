import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/db/migrate.ts', 'src/db/seed.ts'],
    format: ['esm'],
    dts: false,
    splitting: false,
    sourcemap: false,
    clean: true,
    minify: true,
    treeshake: true,
    target: 'node20',
    outDir: 'dist',
});
