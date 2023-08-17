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
        entryPoints: ['test/in/css/index.ts'],
        outdir: 'test/out/css',
        bundle: true,
        plugins: [cssModulesPlugin({
            emitCssBundle: {
                filename: 'asne'
            }
        })],
    })

    await esbuild.build({
        entryPoints: ['test/in/scss/index.ts'],
        outdir: 'test/out/scss',
        bundle: true,
        plugins: [cssModulesPlugin({
            emitCssBundle: {
                filename: 'scss'
            }
        })],
    })

    await esbuild.build({
        entryPoints: ['test/in/sass/index.ts'],
        outdir: 'test/out/sass',
        bundle: true,
        plugins: [cssModulesPlugin({
            emitCssBundle: {
                filename: 'sass'
            }
        })],
    })

    await esbuild.build({
        entryPoints: ['test/in/mixed/index.ts'],
        outdir: 'test/out/mixed',
        bundle: true,
        plugins: [cssModulesPlugin({
            emitCssBundle: {
                filename: 'mixed'
            }
        })],
    })
}

catch (error) {
    console.log(error)
}

console.log('Build succeded')
process.exit(0)




