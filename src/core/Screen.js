/**
 * @module core/Screen
 * @author Roberto Mauro <erremauro@icloud.com>
 */

/**
 * Default bleeding for scroll detection.
 *
 * @constant
 */
const BLEEDING = 0
/**
 * Minimum shake force.
 *
 * @constant
 */
const MIN_SHAKE = 1
/**
 * Maximum shake force.
 *
 * @constant
 */
const MAX_SHAKE = 6

/**
 * A set of utilities for interacting with DOM Elements.
 * @namespace
 */
let Screen = {
  /**
   * Detect if scroll position is over the element considering top, center and
   * bottom of the viewport `postition`. An optional `bleeding` value can be
   * specified to offset the given scroll detect `position`.
   *
   * @static
   *
   * @param  {HTMLElement} target - Target element.
   * @param  {string} position - Scroll detect position (top, center, bottom)
   * @param  {number} bleeding - Scroll detect position offset.
   * @return {boolean} - `True` if scroll is over `targat` or `false`.
   */
  isOver: ( target, position, bleeding ) => {
    var bleeding = bleeding || BLEEDING
    var ref = window.innerHeight
    var rect = target.getBoundingClientRect()

    switch ( position ) {
      case 'top':
        ref = 0
        ref += bleeding
        break
      case 'center':
        ref = ref / 2
        break
      case 'bottom':
        ref -= bleeding
        break
      default:
        // do nothing
    }
    return rect.top <= ref && rect.bottom >= ref
  },
  /**
   * Cross browser `requestAnimationFrame`.
   *
   * @returns {Function} - A compatible `requestAnimationFrame`
   */
  requestAnimationFrame: () => {
    return window.requestAnimationFrame
     || window.mozRequestAnimationFrame
     || window.webkitRequestAnimationFrame
     || window.msRequestAnimationFrame
     || function(f){ setTimeout( f, 1000 / 60 ) }
  },
  /**
   * Check if an object is defined and not null.
   *
   * @static
   * @private
   *
   * @param {!object}  obj
   *
   * @returns true if defined and not null, otherwise false.
   */
  _isDefined( o ) {
    return typeof o !== 'undefined' && 0 !== null
  },
  /**
   * Treat `text` as a css class name and append className accordingly.
   *
   * @static
   * @private
   *
   * @param {string} text - original class name.
   * @param {string} className - Class name(s) to append to `text`
   *
   * @returns {string} `text` with appended `className`.
   */
  _addText: ( text, className ) => {
    var classNames = className
      .split(' ')
      .filter( item => { return Screen._isDefined( item ) && item !== ' ' } )

    for ( var i = 0; i < classNames.length; i++ ) {
      if ( text.indexOf( classNames[ i ] ) === -1 ) {
        text += ' ' + classNames[ i ]
      }
    }
    return text
  },
  /**
   * Treat `text` as a css class name and remove className accordingly.
   *
   * @static
   * @private
   *
   * @param {string} text - original class name.
   * @param {string} className - Class name(s) to append to `text`.
   *
   * @returns {string} `text` without `className`.
   */
  _removeText: ( text, className ) => {
    return text.replace('' + className, '' ).trim()
  },
  /**
   * Add a `className` to an `element` or a `string`.
   *
   * @static
   *
   * @param {HTMLElement|string} target - Target element or string.
   * @param {string} className - Class to be added to the `elment`.
   *
   * @returns {string|true}
   */
  addClass: ( target, className ) => {
    if ( typeof target === 'string' ) {
      return Screen._addText( target, className )
    }
    target.className = Screen._addText( target.className, className )
    return true
  },
  /**
   * Remove a `className` from an `element`.
   *
   * @static
   *
   * @param {HTMLElement|string} element - Target element.
   * @param {string} className - Class to be added to the `elment`.
   *
   * @returns {string|true}
   */
  removeClass: ( target, className ) => {
    if ( typeof target === 'string' ) {
      return Screen._removeText( target, className )
    }
    target.className = Screen._removeText( target.className, className )
    return true
  },
  /**
   * Strip HTML tags from `html` text string.
   *
   * @static
   *
   * @param  { string } html - HTML string
   *
   * @return { string } - text stripped by HTML tags.
   */
  stripHtml: ( html ) => {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  },
  /**
   * Generate random top/left position for simulating an
   * `element` shake.
   *
   * @static
   *
   * @returns {object} - Top and left coordinate.
   */
  shake: () => {
    var x = Screen._shakeIntensity( MIN_SHAKE, MAX_SHAKE )
    var y = Screen._shakeIntensity( MIN_SHAKE, MAX_SHAKE )

    return {
      top: x + 'px',
      left: y + 'px'
    }
  },
  /**
   * Generate a random float between `min` and `max`.
   *
   * @static
   *
   * @returns { number } Random float in `min`-`max` range.
   */
  random: ( min, max ) => {
    return ( Math.random() * ( max - min ) + min ).toFixed( 4 )
  },
  /**
   * Return a shaken position between `min` and `max` intensity.
   *
   * @static
   * @private
   *
   * @returns { number }
   */
  _shakeIntensity: ( min, max ) => {
    var direction = Math.random() > 10 ? -1 : 1
    return Screen.random( min, max ) * direction
  }
}

export default Screen
