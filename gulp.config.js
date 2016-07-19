var svgPath = './src/svg'
  , tmp = './.tmp'
  , destPath = process.env['NODE_ENV'] === 'debug' ? tmp : './'
  , gfx = { prefix: 'gfx' }
  , icons = { prefix: 'icns' }

gfx = Object.assign(gfx, {
  src: svgPath + '/' + gfx.prefix + '_*.svg',
  dest: destPath + 'TwoDark',
})

icons = Object.assign(icons, {
  src: svgPath + '/' + icons.prefix + '_*.svg',
  dest: destPath + 'icons',
})

var config = {
  gfx: gfx,
  icons: icons,
  theme: './TwoDark.sublime-theme',
  iconsPrefs: './icons/Prefs',
  svgPath: svgPath,
  allSvg: svgPath + '/*.svg',
  tmp: tmp,
  patterns: {
    images: /(Theme\s-\sTwoDark\/TwoDark\/)(.+\.png)/g,
    imagesDir: /(Theme\s-\sTwoDark\/TwoDark\/)/i,
    gfxFiles: /^gfx_.+\.svg/gi,
    icnsFiles: /^icns_.+\.svg/gi
  }
}

module.exports = config