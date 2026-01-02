// scripts/update-test-imports.ts
import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function updateTestImports() {
  try {
    // Find all test files
    const testFiles = await glob('src/__tests__/**/*.test.{ts,tsx}', { 
      cwd: rootDir,
      absolute: true 
    });
    
    console.log(`Found ${testFiles.length} test files to process...`);

    for (const file of testFiles) {
      console.log(`\nProcessing: ${path.relative(rootDir, file)}`);
      
      let content = await readFile(file, 'utf-8');
      let updated = false;

      // Replace @/ imports with relative paths
      const updatedContent = content.replace(
        /from\s+['"]@\/([^'"]+)['"]/g,
        (match, importPath) => {
          const absoluteImportPath = path.join(rootDir, 'src', importPath);
          const relativePath = path.relative(
            path.dirname(file),
            absoluteImportPath
          ).replace(/\\/g, '/');

          const finalPath = relativePath.startsWith('.') 
            ? relativePath 
            : `./${relativePath}`;

          console.log(`  Replacing: ${match} -> from '${finalPath}'`);
          updated = true;
          return `from '${finalPath}'`;
        }
      );

      if (updated) {
        await writeFile(file, updatedContent, 'utf-8');
        console.log('  ✓ Updated imports');
      } else {
        console.log('  ✓ No imports to update');
      }
    }

    console.log('\n✅ Done updating test imports!');
  } catch (error) {
    console.error('❌ Error updating test imports:', error);
    process.exit(1);
  }
}

// Run the function
updateTestImports();