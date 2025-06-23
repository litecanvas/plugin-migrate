import litecanvas from "litecanvas"
import pluginMigrate from "../src/index.js"
import test from "ava"
import { setupDOM, onLitecanvas } from "@litecanvas/jsdom-extras"

let local

test.before(() => {
  setupDOM()

  local = litecanvas({
    global: false,
  })

  local.use(pluginMigrate, {
    warnings: false,
  })
})

test.after(() => {
  local.quit()
})

test("CX and CY", async (t) => {
  await onLitecanvas(local, "init", () => {
    {
      const expected = local.W / 2
      const actual = local.CX

      t.is(actual, expected)
    }

    {
      const expected = local.H / 2
      const actual = local.CY
      t.is(actual, expected)
    }
  })
})

test("CENTERX and CENTERY", async (t) => {
  await onLitecanvas(local, "init", () => {
    {
      const expected = local.W / 2
      const actual = local.CENTERX

      t.is(actual, expected)
    }

    {
      const expected = local.H / 2
      const actual = local.CENTERY
      t.is(actual, expected)
    }
  })
})

test("MOUSEX and MOUSEY", async (t) => {
  await onLitecanvas(local, "init", () => {
    {
      const expected = local.MOUSEX
      const actual = local.MX
      t.true(actual !== undefined && actual === expected)
    }

    {
      const expected = local.MOUSEY
      const actual = local.MY
      t.true(actual !== undefined && actual === expected)
    }
  })
})

test("FPS", async (t) => {
  await onLitecanvas(local, "init", () => {
    const expected = ""
    const actual = local.FPS
    t.is(actual, expected)
  })
})

test("ELAPSED", async (t) => {
  let timer = 3

  await onLitecanvas(local, "update", () => {
    timer--
    if (timer === 0) {
      const actual = local.ELAPSED
      const expected = local.T
      t.true(actual !== undefined && actual > 0 && actual === expected)
      return true // ok, resolve
    }
    return false // dont resolve yet
  })
})
