#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const getFiles = require("./lib/get-files");
const svg2png = require("./lib/svg2png");

if (require.main === module) {
	Main(process.argv.splice(2));
} else {
	module.exports = Main;
}

function Main(argv) {
	const prefix = "gfx_";
	const destDirname = "common";
	const rootDir = path.resolve(path.join(__dirname, ".."));

	const gfxPath = path.join(rootDir, `src/svg/${prefix}*.svg`);
	const dest = path.join(rootDir, destDirname);

	if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

	return getFiles(gfxPath).then((files) => {
		const promises = files.map((file) => {
			const filename = path.basename(file, path.extname(file));
			const newFile = path.join(dest, filename).replace(prefix, "");
			return svg2png(file, newFile + ".png");
		});
		return Promise.all(promises);
	});
}
