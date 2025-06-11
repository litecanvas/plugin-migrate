# Migrate Plugin for Litecanvas

Sometimes upgrading litecanvas to a new version can be a lot of work. This plugin makes this easier, by restoring the Litecanvas APIs that were removed in newer versions, and additionally shows warnings in the browser console when removed and/or deprecated APIs are used.

## Install

**NPM**: `npm i @litecanvas/plugin-migrate`

**CDN**: `https://unpkg.com/@litecanvas/plugin-migrate/dist/dist.js`

## Usage

In that example, `clear` and `print` will not cause errors, because this plugin restores these old functions that no longer exist in the latest versions of Litecanvas.

```js
litecanvas({
  loop: { init, draw },
})

use(pluginMigrate)

function draw() {
  clear(0)
  print(0, 0, "Hello World")
}
```
