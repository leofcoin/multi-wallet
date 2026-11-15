import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

test('generated wallet declarations resolve base58 types', () => {
  const fixture = fileURLToPath(new URL('./declaration-types.ts', import.meta.url))
  const project = fileURLToPath(new URL('..', import.meta.url))
  assert.doesNotThrow(() => execFileSync('npx', [
    'tsc',
    '--ignoreConfig',
    '--noEmit',
    '--strict',
    '--skipLibCheck',
    '--target', 'ES2022',
    '--module', 'NodeNext',
    '--moduleResolution', 'NodeNext',
    fixture
  ], { cwd: project, encoding: 'utf8' }))
})
