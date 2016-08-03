/**
 * @module components/Hero
 * @author Roberto Mauro <erremauro@icloud.com>
 *
 * @requires module:react~React
 * @requires module:core/Screen~Screen
 */

import styles from './Hero.scss' // eslint-disable-line
import React, { Component, PropTypes } from 'react'
import Screen from '../../core/Screen'
import { AnimationType } from '../../constants/AnimationType'

/**
 * @classdesc
 *
 * `<Hero />` react component that animate and display an example video.
 *
 * @extends React.Component
 *
 * @property { module:components/Hero~HeroProps } props - Hero component props.
 * @property { HTMLElement } videoElem - HTMLElement video.
 * @property { string } viewClassName - Video class name.
 * @property { HTMLElement } section - Hero section HTMLElement.
 * @property { boolean } videoIsPlaying - Defines if video is playing.
 * @property { boolean } viewIsMaximized - Defines if view is maximized.
 * @property { boolean } animated - Defines if the section is currently animated
 *
 * @description
 *
 * Initialize the internal component state.
 *
 * @param { module:components/Hero~HeroProps } props - Hero react component
 *  props.
 */
class Hero extends Component {
  constructor( props ) {
    super( props )

    this.videoElem = null
    this.viewClassName = ''
    this.viewOpacity = 0
    this.section = null

    this.videoIsPlaying = false
    this.viewIsMaximized = false
    this.animated = false
  }
  /**
   * Retrieve component and video HTMLElement and pause the video.
   */
  componentDidMount() {
    this.section = document.getElementById( 'Hero-Background' )
    if ( this.props.video ) {
      this.videoElem = document.getElementById( 'Hero-Video' )

      var makePlayableInline = require( 'iphone-inline-video' )
      makePlayableInline( this.videoElem, false ) // hasAudio = false

      this.pauseVideo()
    }
  }
  /**
   * Animate the video element when the user scroll overlap the component.
   * @param  {module:components/Hero~HeroProps} nextProps
   * @param  {module:components/Hero~HeroState} nextState
   */
  componentWillUpdate( nextProps, nextState ) {
    if ( Screen.isOver( this.section, 'top', 200 ) ) {
      if ( !this.animated  ) {
        this.animate()
      }
    }
    else {
      if ( this.animated ) {
        this.resetAnimation()
      }
    }
  }
  /**
   * Maximize and play the video. Set the `animated` property to `true`.
   */
  animate() {
    this.animated = true
    this.maximizeWindowView()
    this.playVideo()
  }
  /**
   * Pause and minimize the video. Set the `animated` property to `false`.
   */
  resetAnimation() {
    this.pauseVideo()
    this.minimizeWindowView()
    this.animated = false
  }
  /**
   * Minimize the video by adding CSS animation class to video
   * HTMLElement class name. Set `viewIsMaximized` property to false.
   */
  minimizeWindowView() {
    if ( this.viewIsMaximized ) {
      this.viewClassName = Screen.removeClass( this.viewClassName,
        AnimationType.ZOOM_IN )

      this.viewClassName = Screen.addClass( this.viewClassName,
        AnimationType.ZOOM_OUT )

      this.viewOpacity = 0
      this.viewIsMaximized = false
    }
  }
  /**
   * Maximize the video by adding CSS animation class to video
   * HTMLElement class name. Set `viewIsMaximized` property to true.
   */
  maximizeWindowView() {
    if ( !this.viewIsMaximized ) {
      this.viewClassName = Screen.removeClass( this.viewClassName,
        AnimationType.ZOOM_OUT )

      this.viewClassName = Screen.addClass( this.viewClassName,
        AnimationType.ZOOM_IN )

      this.viewOpacity = 1
      this.viewIsMaximized = true
    }
  }
  /**
   * Play the HTML5 video and set the `videoIsPlaying` property to `true`.
   */
  playVideo() {
    if ( this.props.video && !this.videoIsPlaying ) {
      this.videoElem.play()
      this.videoIsPlaying = true
    }
  }
  /**
   * Stop the HTML5 video and set the `videoIsPlaying` property to `false`.
   */
  pauseVideo() {
    if ( this.props.video && this.videoIsPlaying ) {
      this.videoElem.pause()
      this.videoIsPlaying = false
    }
  }
  /**
   * Create a video element that falls back to static `img` element when
   * not provided and overlap the result to a laptop background image.
   * @returns { module:react~React.Component} `<Hero />` react component.
   */
  render() {
    // Create a video `screenView` when video property is provided
    // otherwise create an image `screenView` using the image property.
    var screenView = ''
      , viewStyle = { opacity: this.viewOpacity }
    if ( this.props.video )  {
      screenView = (
        <video
          id={'Hero-Video'}
          style={viewStyle}
          poster={this.props.poster}
          className={'Hero-Video animated ' + this.viewClassName}
          muted autoPlay loop preload
        >
          <source src={this.props.video} type="video/mp4"></source>
        </video>
      )
    }
    else if ( this.props.image ) {
      screenView = (
        <img
          src={this.props.image}
          style={viewStyle}
          className={'Hero-Image animated ' + this.viewClassName}
        ></img>
      )
    }
    // Render the component.
    return(
      <div id={'Hero'} className={'Hero'}>
        <div className={'Hero-Background-Container'}>
          {screenView}
          <img
            id={'Hero-Background'}
            className={'Hero-Background'}
            src={this.props.background}
          >
          </img>
        </div>
        <div className={'Hero-Description'}>
          <span dangerouslySetInnerHTML={{__html: this.props.description}}>
          </span>
        </div>
      </div>
    )
  }
}

/**
 * @typedef module:components/Hero~HeroProps
 * @property { string } video - Video URL.
 * @property { string } post - Video Poster URL.
 * @property { string } image - Image URL.
 * @property { !string } background - Background URL
 * @property { !string } description - Hero description text.
 * @property { module:components/Hero~ScrollInfo } scroll - Scroll position infos.
 */
Hero.propTypes = {
  video: PropTypes.string,
  poster: PropTypes.string,
  image: PropTypes.string.isRequired,
  background: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  scroll: PropTypes.object,
}

export default Hero
