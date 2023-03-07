# esbuild CSS Modules Plugin

This plugin has been made because none of the actual css-modules plugins allow to work with Server-Side-Rendering and the ones that do, are outdated. In this initial iteration, it works in two ways:

1. For use with `bundle: true`: Bundles css class names into the `js` bundles and output a single `.css` file containing all the css from `*.module.css`'s with correct identifiers. Ideal for client side stuff where you want to bundle everything.
2. For use with `bundle: false`: Creates `*.module.js` files in place of `*.module.css` and updates `import` or `require` statements accordingly. Ideal for SSR where you want to output the html with the correct class names. The `.css` bundle can still be emitted.

# Usage
Use case 1 - Bundle `js` files and create a single `bundle.css` file as well.
```javascript
esbuild.build({
    entryPoints: ['src/index.tsx'],
    // You should use this in place of `outfile`
    outdir: 'static/js',
    bundle: true
    plugins: [cssModulesPlugin({
        // Optional. Will emit a single `.css` file containing all of the css modules content.
        emitCssBundle: {
            // Optional. Defaults to the value of `outdir`
            path: 'static/css',
            // Required. Will append `.css` at the end if missing
            filename: 'bundle'
        }
    })]
})
```
Use case 2 - Upload the files to the server for SSR, preserving the folder structure without bundling. This example uses [glob]() for pattern matching.
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
