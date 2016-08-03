/**
 * @module components/AppIcons
 * @author Roberto Mauro <erremauro@icloud.com>
 *
 * @requires module:react~React
 * @requires  module:core~Screen
 */

import styles from './AppIcons.scss' // eslint-disable-line
import React, { Component, PropTypes } from 'react'
import Screen from '../../core/Screen'
import { AnimationType } from '../../constants/AnimationType'

/**
 * @classdesc
 *
 * `<AppIcons />` react component that showcases TwoDark application icons.
 *
 * @extends React.Component
 *
 * @property { module:components/AppIcons~AppIconProps } props - Component
 *  properties.
 * @property { string } appIconClass - Dynamic app icon class name.
 * @property { boolean } animated - Defines if the component is animated.
 * @property { HTMLelement } section - Component's HTMLElement from the DOM.
 * @property { HTMLElement } appIcons - Icons `<img>` HTMLElement from the DOM.
 *
 * @description
 *
 * Initialize the icons image `<img>` class name and set the initial
 * `animated` state to `false`.
 *
 * @param  { module:components/App~AppIconProps } props - Component properties.
 */
class AppIcons extends Component {
  constructor( props ) {
    super( props )

    this.section = undefined
    this.appIcons = undefined

    this.appIconClass = 'AppIcon-Image'
    this.animated = false
  }
  /**
   * Initialize `section` and `appIcons` to related HTMLElement(s).
   */
  componentDidMount() {
    this.section = document.getElementById('AppIcons')
    this.appIcons = document.getElementById('AppIcons-Image')
  }
  /**
   * Animate the component when appear from the bottom of the screen.
   * @param { module:components/AppIcons~AppIconProps } nextProps - next props.
   */
  componentWillUpdate( nextProps ) {
    if ( Screen.isOver( this.appIcons, 'bottom', 100 ) ) {
      if ( !this.animated) {
        this.animate()
      }
    }
  }
  /**
   * Play component animation.
   */
  animate() {
    this.appIconClass = Screen.addClass(
      this.appIconClass, AppIcons.getAnimatedClass() )
    this.animated = true
  }
  /**
   * Reset component animation.
   */
  resetAnimation() {
    this.appIconClass = Screen.removeClass(
      this.appIconClass, AppIcons.getAnimatedClass() )
    this.animated = false
  }
  /**
   * Render the component
   */
  render() {
    return(
      <div id={'AppIcons'} className={'AppIcon'}>
        <span dangerouslySetInnerHTML={{__html:this.props.lead}}>
        </span>

        <img
          id={'AppIcons-Image'}
          src={this.props.image}
          className={this.appIconClass}
        ></img>

        <span dangerouslySetInnerHTML={{__html:this.props.description}}>
        </span>
      </div>
    )
  }
}

/**
 * Get the complete animation class name in the naming convention:
 * "animated <ANIMATION_TYPE>".
 * @static
 * @returns { string } - Animation type class name.
 */
AppIcons.getAnimatedClass = () => {
  return 'animated ' + AnimationType.BOUNCE
}

/**
 * @typedef module:components/AppIcons~AppIconProps
 * @property { !string } image - Main component image.
 * @property { !string } lead - Lead text for the component.
 * @property { !string } description - Component text description.
 * @property { module:components/AppIcons~ScrollInfo } scroll - Scroll position info.
 */
AppIcons.propTypes = {
  image: PropTypes.string.isRequired,
  lead: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  scroll: PropTypes.object
}

export default AppIcons
