/**
 * Build profile for your project. Replaces the use of requirejs with an AMD
 * loader shim, almond.js, since the built file does not need to use
 * a dynamic loader.
 */
({
  // Where to find the module names listed below.
  baseUrl: '../../js',

  // Where to find modules that are outside of the js/ directory.
  paths: {
  },

  // Use has branch trimming in the build to remove the document.write
  // code in loader.js after a minification is done.
  has: {
    'source-config': false
  },

  // Do not minify with the requirejs optimizer, to allow shipping
  // a non-minified and minified version. The Makefile will do the
  // minification.
  optimize: 'none',

  // Target the AMD loader shim as the main module to optimize,
  // so it shows up first in the built file,
  // since modules use the define/require APIs that the almond
  // provides. Path is relative to baseUrl.
  name: '../build/almond',

  // Files to include along with almond. Their nested dependencies will also be
  // included.
  include: ['main'],

  // Wraps the built file in a closure and exports a closure for your project as a global.
  wrap: {
    startFile: '../wrap.start',
    endFile: '../wrap.end'
  },

  // The built main.js file for use by web sites.
  out: '../../dist/trackliner.js'
})
