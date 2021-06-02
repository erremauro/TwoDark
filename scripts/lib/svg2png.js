const path = require("path");
const sharp = require("sharp");

module.exports = svg2png;

///////////////////////////////////////////

/**
 * Convert an SVG to a multi resolution png.
 * @param  {String} svgFile - Path to the SVG file
 * @param  {String} pngFile - Destination PNG file
 * @return {Promise}
 */
function svg2png(svgFile, pngFile) {
	const basename = path.basename(pngFile, path.extname(pngFile));
	const dirname = path.dirname(pngFile);
	const newFile = path.join(dirname, basename);

	return sharp(svgFile)
		.png()
		.toFile(newFile + "@3x.png")
		.then(({width}) =>
			sharp(svgFile)
				.resize({ 
					width: Math.round(width * 0.5),
					kernel: sharp.kernel.nearest
				})
				.png()
				.toFile(newFile + "@2x.png")
		)
		.then(({ width }) =>
			sharp(svgFile)
				.resize({ 
					width: Math.round(width * 0.5),
					kernel: sharp.kernel.nearest
				})
				.png()
				.toFile(newFile + ".png")
		);
}