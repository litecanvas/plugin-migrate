import "litecanvas"

import { colrect, colcirc } from "@litecanvas/utils"

const defaults = {
  warnings: true,
}

/**
 *
 * @param {LitecanvasInstance} engine
 * @param {typeof defaults} config
 * @returns any
 */
export default function plugin(engine, config = {}) {
  config = Object.assign({}, defaults, config)
  const initialized = engine.stat(1)

  if (initialized) {
    throw 'Plugin Migrate should be loaded before the "init" event'
  }

  /** @type {LitecanvasOptions} */
  const settings = engine.stat(0)

  function warn(old, current, extra = "") {
    if (config.warnings)
      console.warn(
        `[litecanvas/migrate] ${old} is removed. ` +
          (current ? `Use ${current} instead. ` : "") +
          extra
      )
  }

  function seed(value) {
    warn("seed()", "rseed()")
    if (value) {
      engine.rseed(value)
    }
    return engine.stat(9)
  }

  let _fontStyle = ""
  function textstyle(value) {
    warn("textstyle()", "the 5th param of text()")
    _fontStyle = value
  }

  const _core_text = engine.text
  function _text(x, y, str, color = 3, style = _fontStyle) {
    _core_text(x, y, str, color, style)
  }

  function print(x, y, str, color) {
    warn("print()", "text()")
    _text(x, y, str, color)
  }

  function textmetrics(text, size) {
    warn("textmetrics()", "ctx().measureText()")
    const _ctx = engine.ctx()
    const _fontSize = engine.stat(10)
    const _fontFamily = engine.stat(11)
    _ctx.font = `${_fontStyle || ""} ${~~(size || _fontSize)}px ${_fontFamily}`
    const metrics = _ctx.measureText(text)
    metrics.height =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    return metrics
  }

  function cliprect(x, y, width, height) {
    warn("cliprect()", "clip()")
    const _ctx = engine.ctx()
    _ctx.beginPath()
    _ctx.rect(x, y, width, height)
    _ctx.clip()
  }

  function clipcirc(x, y, radius) {
    warn("clipcirc()", "clip()")
    const _ctx = engine.ctx()
    _ctx.beginPath()
    _ctx.arc(x, y, radius, 0, engine.TWO_PI)
    _ctx.clip()
  }

  function getcolor(index) {
    warn("getcolor()", "stat(5)")
    const colors = stat(5)
    return colors[~~index % colors.length]
  }

  function blendmode(value) {
    warn("blendmode()", "ctx().globalCompositeOperation")
    const _ctx = engine.ctx()
    _ctx.globalCompositeOperation = value
  }

  function clear(color) {
    warn("clear()", "cls()")
    engine.cls(color)
  }

  function transform(a, b, c, d, e, f, resetFirst = true) {
    warn("transform()", "ctx().setTransform() or ctx().transform()")
    const _ctx = engine.ctx()
    return _ctx[resetFirst ? "setTransform" : "transform"](a, b, c, d, e, f)
  }

  function mousepos() {
    warn("mousepos()", "MX and MY")
    return [MX, MY]
  }

  function setfps(value) {
    warn("setfps()", "framerate()")
    engine.framerate(value)
  }

  const _core_def = engine.def
  function _def(key, value) {
    switch (key) {
      case "W":
      case "WIDTH":
        _core_def("W", value)
        _core_def("WIDTH", value)
        break
      case "H":
      case "HEIGHT":
        _core_def("H", value)
        _core_def("HEIGHT", value)
        break
      case "T":
      case "ELAPSED":
        _core_def("T", value)
        _core_def("ELAPSED", value)
        break
      case "CX":
      case "CENTERX":
        _core_def("CX", value)
        _core_def("CENTERX", value)
        break
      case "CY":
      case "CENTERY":
        _core_def("CY", value)
        _core_def("CENTERY", value)
        break
      case "MX":
      case "MOUSEX":
        _core_def("MX", value)
        _core_def("MOUSEX", value)
        break
      case "MY":
      case "MOUSEY":
        _core_def("MY", value)
        _core_def("MOUSEY", value)
        break
      default:
        _core_def(key, value)
        break
    }
  }

  function setvar(key, value) {
    warn("setvar()", "def()")
    _def(key, value)
  }

  // restore CX and CY removed in v0.84
  engine.listen("resized", onResize)
  function onResize() {
    _def("CX", engine.W / 2)
    _def("CY", engine.H / 2)
  }
  onResize()

  // restore CANVAS removed in v0.84
  _def("CANVAS", engine.canvas())

  // restore a semi-version of the `resize()`
  function resize(width, height) {
    if (settings.autoscale) {
      throw "resize() don't works with autoscale enabled"
    }

    warn("resize()", null, "Avoid changing the canvas dimensions at runtime.")
    engine.CANVAS.width = width
    _def("W", width)
    _def("CX", width / 2)

    engine.CANVAS.height = height
    _def("H", height)
    _def("CY", height / 2)

    engine.emit("resized", 1)
  }

  for (const key of ["W", "H", "T", "CX", "CY", "MX", "MY"]) {
    if (null != engine[key]) {
      _def(key, engine[key])
    }
  }

  warn(
    "FPS",
    "",
    "but you can use our plugin to measure the fps: https://github.com/litecanvas/plugin-frame-rate-meter"
  )
  _core_def("FPS", "")

  if (settings.fps) {
    engine.framerate(settings.fps)
  }

  // restore the "background" option
  if (settings.background != null) {
    const removeThisListener = engine.listen("before:draw", () => {
      const colors = stat(5)
      engine.canvas().style.background =
        colors[~~settings.background % colors.length]
      removeThisListener()
    })
  }

  // restore path()
  function path(arg) {
    warn(
      "path()",
      "`new Path2D`",
      "See https://developer.mozilla.org/en-US/docs/Web/API/Path2D"
    )
    return new Path2D(arg)
  }

  const _core_fill = engine.fill
  function fill(color, path) {
    if (path instanceof Path2D) {
      warn("fill(color, path)")
      const colors = engine.stat(5)
      const _ctx = engine.ctx()
      _ctx.fillStyle = colors[~~color % colors.length]
      engine.ctx().fill(path)
    } else {
      _core_fill(color)
    }
  }

  const _core_stroke = engine.stroke
  function stroke(color, path) {
    if (path instanceof Path2D) {
      warn("stroke(color, path)")
      const colors = engine.stat(5)
      const _ctx = engine.ctx()
      _ctx.strokeStyle = colors[~~color % colors.length]
      engine.ctx().stroke(path)
    } else {
      _core_stroke(color)
    }
  }

  const _core_clip = engine.clip
  function clip(pathOrCallback) {
    warn(
      "clip(path)",
      "clip(callback)",
      "E.g: `clip((ctx) => ctx.rect(0, 0, 200, 200))`"
    )
    if (pathOrCallback instanceof Path2D) {
      const _ctx = engine.ctx()
      _ctx.clip(pathOrCallback)
    } else {
      _core_clip(pathOrCallback)
    }
  }

  if (settings.antialias) {
    warn('"antialias" option', '"pixelart" option')
  }

  return {
    def: _def,
    seed,
    print,
    clear,
    setfps,
    setvar,
    textstyle,
    textmetrics,
    text: _text,
    cliprect,
    clipcirc,
    blendmode,
    transform,
    getcolor,
    mousepos,
    resize,
    path,
    fill,
    stroke,
    clip,

    // restore collision utils
    colrect,
    colcirc,
  }
}
