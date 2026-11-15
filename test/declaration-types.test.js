import assert from 'node:assert/strict'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

test('generated wallet declarations resolve base58 types', () => {
  const fixture = fileURLToPath(new URL('./declaration-types.ts', import.meta.url))
  const program = ts.createProgram([fixture], {
    noEmit: true, strict: true, target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext, types: []
  })
  const errors = ts.getPreEmitDiagnostics(program).filter(error => !error.file?.fileName.includes('/node_modules/'))
  assert.deepEqual(errors.map(error => ts.flattenDiagnosticMessageText(error.messageText, '\n')), [])
})
