import type {Plugin, BuildOptions, Loader} from 'esbuild'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {extname, join, parse, resolve} from 'node:path'
import postcss from 'postcss'
import postcssModulesPlugin from 'postcss-modules'

export interface CssModulesOptions {
    emitCssBundle?: {
        path?: string,
        filename: string
    }
    scopedNames?: string
}

let js: string | null 

function generateJS(buildOptions: BuildOptions, pluginOptions?: CssModulesOptions) {
    const postcssModules = postcssModulesPlugin({
        getJSON(cssFilename, json, outputFilename) {
            let exports: string = 'export default '

            if (buildOptions.format === 'cjs') {
                exports = 'module.exports = '
            }

            js = exports + JSON.stringify(json, null, 4)
        },
        generateScopedName: pluginOptions?.scopedNames
    })

    return postcssModules
}

export function cssModulesPlugin(options?: CssModulesOptions): Plugin {
    let css: string

    return {
        name: 'css-modules',
        setup(build) {
            try {
                build.onLoad({filter: /\.module\.css$/}, async args => {
                    const file = await readFile(args.path, 'utf-8')
                    const postcssModules = generateJS(build.initialOptions, options)
                    const postcssResult = await postcss(postcssModules).process(file, {
                        from: args.path,
                        to: build.initialOptions.outdir,
                    })

                    if (options?.emitCssBundle && postcssResult.css) {
                        css ??= ''
                        css += postcssResult.css + '\n\n'
                    }

                    if (js) {
                        return {
                            contents: js
                        }
                    }
                })

                if (!build.initialOptions.bundle) {                    
                    build.onLoad({filter: /\.(js|jsx|ts|tsx)$/}, async args => {
                        let loader: Loader | undefined
                        let file = await readFile(args.path, 'utf-8')
                        
                        const extension = extname(args.path)
                        const matches = file.match(/(import|require).+\.module.css/g)

                        if (matches) for (const match of matches) {
                            const toJS = match.replace('.module.css', '.module.js')
                            const path = match.replace(/(import|require).+(\'|\")/, '')
                            const fullPath = resolve(join(parse(args.path).dir, path))

                            if (Array.isArray(build.initialOptions.entryPoints)) {
                                build.initialOptions.entryPoints.forEach(i => {
                                    if (typeof i === 'string' && resolve(i) === fullPath) {
                                        file = file.replace(match, toJS)
                                    }
                                })
                            }
                        }

                        switch (extension) {
                            case '.ts':
                            case '.js':
                            case '.tsx':
                            case '.jsx':
                                loader = extension.substring(1) as Loader
                        }
                        
                        return {contents: file, loader}
                    })
                }

                build.onEnd(async result => {
                    if (css && options?.emitCssBundle) {
                        const dir = options.emitCssBundle.path ?? build.initialOptions.outdir
                        if (dir) {
                            let path = join(dir, options.emitCssBundle.filename)
                            if (!path.endsWith('.css')) {
                                path += '.css'
                            }

                            try {
                                await mkdir(dir, {recursive: true})
                            } 
                            catch {}

                            await writeFile(path, css)
                        }
                    }

                    js = null
                    
                    return
                })  
            }

            catch (error) {
                console.log(error)
            }
        }
    }
}