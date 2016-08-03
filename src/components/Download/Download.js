/**
 * @module components/Download
 * @author Roberto Mauro <erremauro@icloud.com>
 *
 * @requires module:react~React
 * @requires module:core/Screen~Screen
 */

/* eslint no-unused-vars: 'off' */
import React, { Component, PropTypes } from 'react'
import styles from './Download.scss'
import Screen from '../../core/Screen'

/**
 * Shake animation refresh rate.
 * @constant
 */
const SHAKE_FREQUENCY = 75

/**
 * @classdesc
 *
 * `<Download />` react component that renders and animate a link to the
 * github project.
 *
 * @extends React.Component
 *
 * @property { boolean } animated - Defines if the component is animated.
 * @property { Function} shakeAnimation - Shake animation interval function.
 * @property { module:components/Download~DownloadProps } props -
 *  Component props
 * @property { module:components/Download~DownloadState } state -
 *  Component state
 *
 * @description
 *
 * Initialize the internal state and set the `animated` property to `false`.
 *
 * @param { module:components/Download~DownloadProps } props - Download react
 *  component props.
 */
class Download extends Component {
  constructor( props ) {
    super( props )
    this.animated = false
    this.shakeAnimation = null
    this.state = {
      top: '',
      left: ''
    }
  }
  /**
   * Listen to `mouseover` and `mouseout` events from the `link HTMLElement`.
   */
  componentDidMount() {
    this.linkElem = document.getElementById( 'Download-Link' )
    this.imgElem = document.getElementById( 'Download-Image' )
    this.linkElem.addEventListener(
      'mouseover', this.handleMouseOver.bind( this ) )
    this.linkElem.addEventListener(
      'mouseout', this.handleMouseOut.bind( this ) )
  }
  /**
   * Stop listening to the `mouseover` and `mouseout` events
   * related to the `link HTMLElement`.
   */
  componentWillUnmount() {
    this.linkElem.removeEventListener(
      'mouseover', this.handleMouseOver.bind( this ) )
    this.linkElem.removeEventListener(
      'mouseout', this.handleMouseOut.bind( this ) )
  }
  /**
   * [Shake]{@link modules:components/core~Screen~Screen#shake} the GitHun mark
   * when mouse is over download link.
   * @callback module:component/Download~Download#handleMouseOverCallback
   */
  handleMouseOver() {
    var origin = false
    var animFram = Screen.requestAnimationFrame()
    if ( !this.animated ) {
      this.animated = true
      this.shakeAnimation = setInterval( () => {
        var state = origin ?
          Screen.shake( this.imgElem ) :
          { top: '', left: '' }
        // eslint-disable-next-line react/no-set-state
        this.setState( state )
        origin = !origin
      }, SHAKE_FREQUENCY )
    }
  }
  /**
   * Stop [shaking]{@link modules:components/core~Screen~Screen#shake}
   * the GitHun mark when mouse is off the download link.
   * @callback module:component/Download~Download#handleMouseOutCallback
   */
  handleMouseOut() {
    var animFram = Screen.requestAnimationFrame()
    if ( this.animated ) {
      clearInterval(this.shakeAnimation)
      // eslint-disable-next-line react/no-set-state
      this.setState({
        top: '',
        left: ''
      })
      this.animated = false
    }
  }
  /**
   * Set the GitHub mark position using dynamic css style properties (for
   * still/shaken state) and strip html tags from
   * [linkText]{@link module:components/Download~DownloadProps}
   * @returns { module:react~React.Component} `<Download />` react component.
   */
  render() {
    var imgStyle = Object.assign( this.state, { position: 'relative' } )
    var linkText = Screen.stripHtml( this.props.linkText )
    return(
      <div id={'Download'} className={'Download'}>
        <span dangerouslySetInnerHTML={{__html:this.props.description}}>
        </span>

        <img
          src={this.props.image}
          id={'Download-Image'}
          style={imgStyle}
          className={'Download-Image'}
        ></img>

        <a
          id={'Download-Link'}
          href={this.props.url}
          title="Download TwoDark from GitHub"
          className={'Download-Link'}
        >
          {linkText}
        </a>

      </div>
    )
  }
}

/**
 * Download component properties.
 * @typedef module:components/Download~DownloadProps
 *
 * @property { string } image - GitHub mark image URL.
 * @property { string } url - GitHub project url.
 * @property { string } linkText - Text for the download link.
 * @property { string } description - Component text description.
 */
Download.propTypes = {
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}

export default Download
