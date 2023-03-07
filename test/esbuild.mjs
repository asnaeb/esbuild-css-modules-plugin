//@ts-check

import esbuild from 'esbuild'
import {cssModulesPlugin} from '../lib/index.js'
import {glob} from 'glob'
import {rm} from 'node:fs/promises'

try {
    await rm('test/out', {recursive: true})
}
catch {}

try {
    await esbuild.build({
        entryPoints: await glob('test/in/index.ts'),
        outdir: 'test/out',
        outbase: 'test/in',
        allowOverwrite: true,
        format: 'esm',
        splitting: true,
        plugins: [cssModulesPlugin()],
        bundle: true
    })
}

catch (error) {
    console.log(error)
}

console.log('Build succeded')
process.exit(0)




