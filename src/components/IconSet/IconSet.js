/**
 * @module components/IconSet
 * @author Roberto Mauro <erremauro@icloud.com>
 *
 * @requires module:react~React
 * @requires module:core/Screen~Screen
 */

import styles from './IconSet.scss' // eslint-disable-line
import React, { Component, PropTypes } from 'react'
import Screen from '../../core/Screen'
import { AnimationType } from '../../constants/AnimationType'

/**
 * @classdesc
 *
 * `<IconSet />` react component that describe sidebar icons and display
 * an image of the theme applied to a Sublime Text window.
 *
 * @extends React.Component
 *
 * @property { module:component/IconSet~IconSetProps} props - IconSet props.
 * @property { string } imgClassName - TwoDark window image.
 * @property { number } imgAlpha - TwoDark window image opacity style value.
 * @property { boolean } animated - Defines if the component is animated.
 * @property { HTMLElement } image - TwoDark window image DOM element.
 *
 * @description
 *
 * Initialize the internal state of the component and set the `animated`
 * property to `false`.
 *
 * @param { module:component/IconSet~IconSetProps } props - IconSet react
 *  component props.
 */
class IconSet extends Component {
  constructor( props ) {
    super( props )
    this.image = null
    this.imgClassName = 'FileIcon-Image'
    this.imgAlpha = 0
    this.animated = false
  }
  /**
   * Retrieve the TwoDark window image from the DOM.
   */
  componentDidMount() {
    this.image = document.getElementById( 'FileIcon-ImageBox' )
  }
  /**
   * Animate the Sublime Text window image while appearing from
   * the bottom of the screen, when user scroll reaches the image.
   * @param  { module:components/IconSet~IconSetProps } nextProps
   * @param  { module:components/IconSet~IconSetState } nextState
   */
  componentWillUpdate( nextProps, nextState ) {
    if ( Screen.isOver( this.image, 'bottom', 100 ) ) {
      if ( !this.animated ) {
        this.animate()
      }
    }
  }
  /**
   * Animate the window image by adding CSS animation class to the
   * `imgClassName` property. Set element opacity to `1` and update `animated`
   * property to `true`.
   */
  animate() {
    this.imgClassName = Screen.addClass( this.imgClassName,
      'animated ' + AnimationType.BOUNCE_IN_UP )
    this.imgAlpha = 1
    this.animated = true
  }
  /**
   * Stop animating the window image by removing CSS animation class from the
   * `imgClassName` property. Set element opacity to `0` and update `animated`
   * property to `false`.
   */
  resetAnimation() {
    this.imgAlpha = 0
    this.animated = false
    this.imgClassName = Screen.removeClass( this.imgClassName,
      'animated ' + AnimationType.BOUNCE_IN_UP )
  }
  /**
   * Render the component
   */
  render() {
    var imgStyle = { opacity: this.imgAlpha }
    return(
      <div id={'IconSet'} className={'FileIcon'}>
        <div className={'FileIcon-TextBox'}>
          <img src={this.props.iconset} className={'FileIcon-Iconset'}></img>
          <span dangerouslySetInnerHTML={{__html:this.props.description}}>
          </span>
        </div>
        <div id={'FileIcon-ImageBox'} className={'FileIcon-ImageBox'}>
          <div className={'FileIcon-Image-Container'} style={imgStyle}>
            <img
              id={'IconSet-Image'}
              src={this.props.image}
              className={this.imgClassName}
            ></img>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * `<IconSet />` component properties.
 * @typedef module:components/IconSet~IconSetProps
 * @property { string } image - TwoDark window image url.
 * @property { string } description - Text description.
 * @property { string } iconset - Sidebar iconset image url.
 * @property { module:components/App~ScrollInfo } scroll - Scroll infos.
 */
IconSet.propTypes = {
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  iconset: PropTypes.string,
  scroll: PropTypes.object,
}

export default IconSet
