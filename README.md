# Plugin Migrate for Litecanvas

Sometimes upgrading litecanvas to a new version can be a lot of work. This plugin makes this easier, by restoring the Litecanvas APIs that were removed in newer versions, and additionally shows warnings in the browser console when removed and/or deprecated APIs are used.

<!-- prettier-ignore -->
> [!TIP]
> **This plugin is automatically loaded on Litecanvas [playground](https://litecanvas.js.org/) to maintain compatibility and avoid breaking code written for older versions.**

## Install

**NPM**: `npm i @litecanvas/plugin-migrate`

**CDN**: `https://unpkg.com/@litecanvas/plugin-migrate/dist/dist.js`

## Usage

In that example, `clear` and `print` will not cause errors, because this plugin restores these old functions that no longer exist in the latest versions of Litecanvas.

```js
litecanvas({
  loop: { init, draw },
})

use(pluginMigrate, {
  // set to `false` to not show warnings in the console (default is true)
  warnings: true,
})

function draw() {
  clear(0)
  print(0, 0, "Hello World")
}
```
