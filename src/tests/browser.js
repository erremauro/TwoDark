import { jsdom } from 'jsdom'

const defaultMarkup = `
<!doctype HTML>
<html>
  <head>
  <title>Prototype Tests</title>
  </head>
  <body>
  </body>
</html>
`

let browser = ( markup ) => {
  global.document = jsdom( markup || defaultMarkup )
  global.window = global.document.defaultView
  global.navigator = window.navigator = {}
  global.navigator.userAgent = 'node.js'
}

browser()
