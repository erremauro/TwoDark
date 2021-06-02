const glob = require('glob');

module.exports = getFiles

///////////////////////////////////////////

function getFiles(path, options = {}) {
	return new Promise((resolve, reject) => {
		glob(path, options, (err, files) => {
			if (err) return reject(err);
			resolve(files);
		});
	});
}