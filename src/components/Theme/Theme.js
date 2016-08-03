/**
 * @module components/Theme
 * @author Roberto Mauro <erremauro@icloud.com>
 *
 * @requires module:react~React
 * @requires module:core/Screen~Screen
 */

import styles from './Theme.scss' // eslint-disable-line
import React, { Component, PropTypes } from 'react'
import Screen from '../../core/Screen'
import { AnimationType } from '../../constants/AnimationType'

/**
 * Theme Color Scheme element class name.
 * @const
 * @type { string }
 */
const COLOR_SCHEME_CLASS = 'Theme-ColorScheme'
/**
 * A list of theme colors use for naming palette HTMLElement(s).
 * @const
 * @type {string[]}
 */
const PALETTE = [ 'Blue', 'Red', 'Yellow', 'Green', 'Violet' ]

/**
 * @classdesc
 *
 * `<Theme />` react component that showcase the theme color palette.
 *
 * @extends React.Component
 *
 * @property { module:components/Theme~ThemeProps} props - Theme props.
 * @property { string } codeImageClass - Code image class name.
 * @property { number } codeImageOpacity - Code image opacity value.
 * @property { boolean } codeImageAnimaged - Code image animation flag.
 * @property { number } paletteOpacity - Color palette opacity value.
 * @property { boolean } paletteAnimated - Color palette animation flag.
 * @property { HTMLElement } colorScheme - Color palette DOM element.
 * @property { HTMLElement } codeImage - Code example image `img` DOM element.
 *
 * @description
 *
 * Initialize the internal state, set `codeImageAnimated` and `paletteAnimated`
 * properties to `false`.
 *
 * @param { module:components/Theme~ThemeProps } props - IconSet react component
 *   props.
 */
class Theme extends Component {
  constructor( props ) {
    super( props )

    this.colorScheme = null
    this.codeImage = null

    this.codeImageClass = ''
    this.codeImageOpacity = 0
    this.codeImageAnimated = false

    this.paletteOpacity = 0
    this.paletteAnimated = false
  }
  /**
   * Retrieve code image and color palete DOM elements.
   */
  componentDidMount() {
    this.colorScheme = document.getElementById(
      'Theme-ColorScheme-Container')
    this.codeImage = document.getElementById( 'Theme-Image-Container' )
  }
  /**
   * Run the palette zoom animation or the code image slide up animation,
   * when user scroll reach one of those DOM elements from the bottom.
   *
   * @param { module:components/Theme~ThemeProps } nextProps
   */
  componentWillUpdate( nextProps, nextState ) {
    if ( Screen.isOver( this.colorScheme, 'bottom', 100 ) ) {
      if ( !this.paletteAnimated ) {
        this.animateColorScheme()
      }
    }
    if ( Screen.isOver( this.codeImage, 'bottom', 100 ) ) {
      if ( !this.codeImageAnimated ) {
        this.animateCodeImage()
      }
    }
  }
  /**
   * Set the `paletteOpacity` property to `1` and `paletteAnimation` to `true`
   * causing the palette DOM element to animate.
   */
  animateColorScheme() {
    this.paletteOpacity = 1
    this.paletteAnimated = true
  }
  /**
   * Reset the palette animated property and opacity value to `0` and `false`.
   */
  resetColorSchemeAnimation() {
    this.paletteOpacity = 0
    this.paletteAnimated = false
  }
  /**
   * Animate the code image by adding CSS animation class to the `codeImageClass`
   * property.
   */
  animateCodeImage() {
    this.codeImageOpacity = 1
    this.codeImageClass = Screen.addClass( this.codeImageClass,
        'animated ' + AnimationType.SLIDE_IN_UP )
    this.codeImageAnimated = true
  }
  /**
   * Stop the code image animation by removing CSS animation class from the
   * `codeImageClass` property.
   */
  resetCodeImageAnimation() {
    this.codeImageOpacity = 0
    this.codeImageClass = Screen.removeClass( this.codeImageClass,
        'animated ' + AnimationType.SLIDE_IN_UP )
    this.codeImageAnimated = false
  }
  /**
   * Create the color palette elements and set the animation state based on
   * `animate` property value at times of rendering.
   *
   * @returns {module:react~React.Component[]} Color palette components.
   */
  createColorPaletteNodes() {
    var $i = 1
    var paletteStyle = {
      opacity: this.paletteOpacity
    }
    var isAnimated = this.paletteAnimated
    return PALETTE.map( colorName => {
      var paletteName = COLOR_SCHEME_CLASS + '-' + colorName +
        ' animated-' + $i
      var className =  isAnimated ?
        paletteName + ' ' + AnimationType.ZOOM_IN : paletteName
      $i++
      return(
        <div
          key={paletteName}
          className={className}
          style={paletteStyle}
        ></div>
      )
    })
  }
  /**
   * Update color scheme and palette opacity value and render the component.
   */
  render() {
    var colorSchemeStyle = { opacity: this.paletteOpacity }
    var codeImageStyle = { opacity: this.codeImageOpacity }
    var colorPaletteNodes = this.createColorPaletteNodes()
    return(
      <section id={'Theme'} className={'Theme'}>
        <div id={'Theme-TextBox'} className={'Theme-TextBox'}>
          <div
            id={'Theme-ColorScheme-Container'}
            className={'Theme-ColorScheme-Container'}
            style={colorSchemeStyle}
          >
            <div className={'Theme-ColorScheme'}>
              {colorPaletteNodes}
            </div>
          </div>
          <span dangerouslySetInnerHTML={{__html:this.props.description}}>
          </span>
        </div>
        <div id={'Theme-ImageBox'} className={'Theme-ImageBox'}>
          <div
            id={'Theme-Image-Container'}
            className={'Theme-Image-Container'}
            style={codeImageStyle}
          >
            <img
              id={'Theme-Image'}
              src={this.props.image}
              className={'Theme-Image ' + this.codeImageClass}
            ></img>
          </div>
        </div>
      </section>
    )
  }
}

/**
 * @typedef module:components/Theme~ThemeProps
 * @property { string } image - Code image url.
 * @property { string } description - Component text description.
 * @property { module:components/App~ScrollInfo } scroll - Current scroll info.
 */
Theme.propTypes = {
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  scroll: PropTypes.object,
}

export default Theme
