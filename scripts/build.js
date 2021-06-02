#! /usr/bin/env node
const logger = require("rear-logger")("TwoDarkBuild");
const pkg = require(__dirname + "/../package.json");
const convertGfx = require("./convert-gfx");
const convertIcons = require("./convert-icons");

if (require.main === module) {
  Main(process.argv.splice(2));
} else {
  module.exports = Main;
}

function Main(argv) {
  logger.highlight(`${pkg.name} v${pkg.version}`);

  logger.log("%c[1/2]%c Converting graphics...", "gray", "reset");
  convertGfx()
    .then(() => {
      logger.log("%c[2/2]%c Converting icons...", "gray", "reset");
      return convertIcons();
    })
    .catch((err) => {
      logger.error(err);
    })
}
