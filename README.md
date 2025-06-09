# Migrate Plugin for Litecanvas

Migrate Plugin makes this easier, by restoring the Litecanvas APIs that were removed in newer versions, and additionally shows warnings in the browser console when removed and/or deprecated APIs are used.

## Install

**NPM**: `npm i @litecanvas/plugin-migrate`

**CDN**: `https://unpkg.com/@litecanvas/plugin-migrate/dist/dist.js`

## Usage

```js
litecanvas({
  loop: { init, draw },
})

use(pluginMigrate)

function draw() {
  clear(0) // clear() was a alias for cls()

  print(0, 0, "Hello World") // print() was a alias for text()
}
```
