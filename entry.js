const express = require('express')

require = require("esm")(module)
let _exports = module.exports = require("./index.js")

_exports.app.listen(process.env.PORT || 8086);
