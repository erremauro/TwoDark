/**
 * @module core/Api
 * @author Roberto Mauro <erremauro@icloud.com>
 */
import heroDesc from '../data/text/Hero.description.md'
import fileIconDesc from '../data/text/IconSet.description.md'
import themeDesc from '../data/text/Theme.description.md'
import appIconLead from '../data/text/AppIcons.lead.md'
import appIconDesc from '../data/text/AppIcons.description.md'
import downloadDesc from '../data/text/Download.description.md'
import downloadLinkText from '../data/text/Download.linkText.md'
import appFooterText from '../data/text/App.footer.md'
import media from '../data/media.js'

var text = {
  App: {
    footerText: appFooterText,
  },
  Hero: {
    description: heroDesc
  },
  IconSet: {
    description: fileIconDesc
  },
  Theme: {
    description: themeDesc
  },
  AppIcons: {
    lead: appIconLead,
    description: appIconDesc
  },
  Download: {
    description: downloadDesc,
    linkText: downloadLinkText
  }
}

/**
 * @type {module:components/App~AppState}
 */
let AppState = {
  media: media,
  text: text,
  scroll: {
    top: 0
  }
}

/**
 * @class
 * @classdesc
 *
 * Application state Api.
 */
let Api = {
  /**
   * Return the application state.
   * static
   * @return { module:components/App~AppState } Application state.
   */
  getAppState: () => {
    return AppState
  }
}

export default Api
