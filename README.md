# esbuild CSS Modules Plugin

This plugin has been made because none of the actual css-modules plugins allow to work with Server-Side-Rendering and the ones that do, are outdated. In this initial iteration, it can:

1. With `bundle: true`: Bundle css hashed class names into entrypoints bundles and outputs a single `.css` file containing all the css from `*.module.css`'s with correct identifiers. Ideal for client side stuff where you want to bundle everything.
2. With `bundle: false`: Create `*.module.js` files in place of `*.module.css` and updates `import` or `require` statements accordingly in output files. Ideal for SSR where you want to output the html with the correct class names. A `.css` bundle can still be emitted.

# Usage
**Example 1** - **Client Side Bundles**

Bundle `js` files and create a single `bundle.css` file as well at the desired location.
```javascript
esbuild.build({
    entryPoints: ['src/index.tsx'],
    // You should use this in place of `outfile`
    outdir: 'static/js',
    bundle: true
    plugins: [cssModulesPlugin({
        // Optional. Will emit a `.css` bundle containing all of the imported css.
        emitCssBundle: {
            // Optional. Defaults to the value of `outdir`
            path: 'static/css',
            // Required. Will append `.css` at the end if missing
            filename: 'bundle'
        }
    })]
})
```
**Example 2** - **Server Side Rendering** 

Preserve the folder structure without bundling, transform `.module.css` into `module.js`. This example uses [glob](https://www.npmjs.com/package/glob) for pattern matching.
```javascript
esbuild.build({
    // `.css` files must be included in entryPoints when `bundle: false`
    entryPoints: await glob('src/**/*.{ts,tsx,css}'),
    outdir: 'server/ssr',
    bundle: false,
    // emitCssBundle can be used as well if needed. It will produce the same result regardless of `bundle` setting
    plugins: [cssModulesPlugin()]
})
```

# Coming
More features will be added in the next future.
