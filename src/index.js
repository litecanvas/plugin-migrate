import "litecanvas"

const defaults = {
  mute: false,
}

/**
 *
 * @param {LitecanvasInstance} engine
 * @param {object} config
 * @returns any
 */
export default function plugin(engine, config = defaults) {
  const initialized = engine.stat(1)

  if (initialized) {
    throw 'Plugin Migrate should be loaded before the "init" event'
  }

  function warn(old, current) {
    if (!config.mute) console.warn(`${old} is removed. Use ${current} instead.`)
  }

  function seed(value) {
    warn("seed", "rseed")
    if (value) {
      engine.rseed(value)
    }
    return engine.stat(9)
  }

  function print(x, y, str, color) {
    warn("print", "text")
    engine.text(x, y, str, color)
  }

  function clear(color) {
    warn("clear", "cls")
    engine.cls(x, y, str, color)
  }

  function setfps(value) {
    warn("setfps", "framerate")
    engine.framerate(value)
  }

  function setvar(key, value) {
    warn("setvar", "def")
    _def(key, value)
  }

  const def = engine.def
  function _def(key, value) {
    switch (key) {
      case "W":
      case "WIDTH":
        def("W", value)
        def("WIDTH", value)
        break
      case "H":
      case "HEIGHT":
        def("H", value)
        def("HEIGHT", value)
        break
      case "T":
      case "ELAPSED":
        def("T", value)
        def("ELAPSED", value)
        break
      case "CX":
      case "CENTERX":
        def("CX", value)
        def("CENTERX", value)
        break
      case "CY":
      case "CENTERY":
        def("CY", value)
        def("CENTERY", value)
        break
      case "MX":
      case "MOUSEX":
        def("MX", value)
        def("MOUSEX", value)
        break
      case "MY":
      case "MOUSEY":
        def("MY", value)
        def("CENTERY", value)
        break
      default:
        break
    }
  }

  return {
    seed,
    print,
    clear,
    setfps,
    setvar,
  }
}
