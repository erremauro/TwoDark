/**
 * @module components/App
 * @author Roberto Mauro <erremauro@icloud.com>
 *
 * @requires module:react
 * @requires module:core/Api
 * @requires module:core/Screen
 * @requires module:components/Hero
 * @requires module:components/IconSet
 * @requires module:components/Theme
 * @requires module:components/AppIcons
 * @requires module:components/Download
 */

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react'
import styles from './App.scss'
import { AnimationType } from '../../constants/AnimationType'
/* eslint-enable */

import Api from '../../core/Api'
import Hero from '../Hero/Hero'
import IconSet from '../IconSet/IconSet'
import Theme from '../Theme/Theme'
import AppIcons from '../AppIcons/AppIcons'
import Download from '../Download/Download'
import Screen from '../../core/Screen'


/**
 * Get the App state from [Api]{ @link module:core/Api~Api }
 * @see: { @link module:core/Api~Api }
 * @private
 * @returns { module:components/App~AppState }
 */
let _getAppState = () => {
  return Api.getAppState()
}

/**
 * @classdesc
 * `<App />` main react component.
 *
 * Is reponsible for managing the app state,
 * updating and rendering all app sub-components.
 *
 * @property { module:components/App~AppState } state - The Application State.
 * @property { boolean } animated - Defines if App view is currently animated.
 *
 * @description
 * Get the initial application state and set the `animated` property to `false`.
 * @param {module:components/App~AppProps} React component properties.
 */
class App extends Component {
  constructor( props ) {
    super( props )
    this.state = _getAppState()
    this.animated = false
  }
  /**
   * Add scroll event listener before the app is mounted on the DOM.
   */
  componentWillMount() {
    window.addEventListener( 'scroll', this.handleScroll.bind( this ) )
  }
  /*+
   * Animate the background color fade when scroll is a over a predefined
   * threshold.
   * @param { object } nextProps - Next props from update.
   * @param { AppState } nextState - Next state from update.
   */
  componentWillUpdate( nextProps, nextState ) {
    if ( nextState.scroll.top >= 100 && !this.animated ) {
      this.animate()
    }
    else if ( nextState.scroll.top <= 100 && this.animated ) {
      this.resetAnimation()
    }
  }
  /**
   * Remove scroll event listener before the app is unmounted from the DOM.
   */
  componentWillUnmount() {
    window.removeEventListener( 'scroll', this.handleScroll.bind( this ) )
  }
  getAppContainer() {
    return document.body
  }
  /**
   * Light up the background color and set the `animated` state to true.
   */
  animate() {
    this.animated = true
    var container = this.getAppContainer()
    container.style.transition = 'all 0.5s linear'
    Screen.addClass( container, AnimationType.BG_COLOR_FADE )
  }
  /**
   * Reset the background fade animation.
   */
  resetAnimation() {
    var container = this.getAppContainer()
    Screen.removeClass( container, AnimationType.BG_COLOR_FADE )
    this.animated = false
  }
  /**
   * Update App state scroll property when a scroll event is emitted from
   * the viewport.
   *
   * The `scroll` [AppState]{@link module:components/App~AppState}
   * property is consumed by all App sub-components, therefore this change will
   * trigger an update on all sub-components to reflecting the new value.
   *
   * @param {scroll} event - The scroll event.
   */
  handleScroll( event ) {
    // eslint-disable-next-line react/no-set-state
    this.setState( { scroll: { top: window.scrollY } } )
  }
  /**
   * Render the component and all sub-components.
   */
  render() {
    return(
      <div id="Gh-Pages-App" className={'App'}>
        <header className={'Header'}>
          <h1 id={'Header-Title'}>Two Dark</h1>
        </header>

        <Hero
          video={this.state.media.Hero.video}
          poster={this.state.media.Hero.poster}
          background={this.state.media.Hero.background}
          image={this.state.media.Hero.altImage}
          description={this.state.text.Hero.description}
          scroll={this.state.scroll}
        />

        <IconSet
          image={this.state.media.IconSet.image}
          iconset={this.state.media.IconSet.iconset}
          description={this.state.text.IconSet.description}
          scroll={this.state.scroll}
        />

        <Theme
          image={this.state.media.Theme.image}
          description={this.state.text.Theme.description}
          scroll={this.state.scroll}
        />

        <AppIcons
          lead={this.state.text.AppIcons.lead}
          image={this.state.media.AppIcons.image}
          description={this.state.text.AppIcons.description}
          scroll={this.state.scroll}
        />

        <Download
          url={this.state.media.Download.link}
          linkText={this.state.text.Download.linkText}
          image={this.state.media.Download.image}
          description={this.state.text.Download.description}
        />

        <footer className={'Footer'}>
          <span
            dangerouslySetInnerHTML={{__html: this.state.text.App.footerText}}
          >
          </span>
        </footer>
      </div>
    )
  }
}

App.propTypes = {
  // no props
}

export default App
