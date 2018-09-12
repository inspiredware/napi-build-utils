'use strict'
// Copyright (c) 2018 inspiredware

var path = require('path')
var pkg = require(path.resolve('package.json'))

var versionArray = process.version
  .substr(1)
  .replace(/-.*$/, '')
  .split('.')
  .map(function (item) {
    return +item
  })

/**
 *
 * A set of utilities to assist developers of tools building
 * [N-API](https://nodejs.org/api/n-api.html#n_api_n_api) native add-ons.
 *
 * The main repository can be found [here](https://github.com/inspiredware/napi-build-utils).

 * @module napi-build-utils
 */

/**
 * Implements a consistent name of `napi` for N-API runtimes.
 *
 * @poram {string} runtime The runtime string.
 * @returns {boolean}
 */
exports.isNapiRuntime = function (runtime) {
  return runtime === 'napi'
}

/**
 * Determines whether the specified N-API version is supported
 * by both the currently running Node instance and the package.
 *
 * @poram {string} napiVerison The N-API version to check.
 * @returns {boolean}
 */
exports.isSupportedVersion = function (napiVerison) {
  var version = parseInt(napiVerison, 10)
  return version <= exports.getNapiVersion() && exports.packageSupportsVersion(version)
}

/**
 * Determines whether the specified N-API version is supported by the package.
 * The N-API version must be preseent in the `package.json`
 * `binary.napi_versions` array.
 *
 * @poram {number} napiVerison The N-API version to check.
 * @returns {boolean}
 * @private
 */
exports.packageSupportsVersion = function (napiVerison) {
  if (pkg.binary && pkg.binary.napi_versions) {
    for (var i = 0; i < pkg.binary.napi_versions.length; i++) {
      if (pkg.binary.napi_versions[i] === napiVerison) return true
    };
  };
  return false
}

/**
 * Issues a warning to the supplied log if the N-API version is not supported
 * by the current Node instance or if the N-API version is not supported
 * by the package.
 *
 * @param {string} napiVerison The N-API version to check.
 * @param {Object} log The log object to which the warnings are to be issued.
 * Must implement the `warn` method.
 */
exports.logUnsupportedVersion = function (napiVerison, log) {
  if (!exports.isSupportedVersion(napiVerison)) {
    if (exports.packageSupportsVersion(napiVerison)) {
      log.warn('This Node instance does not support N-API version', napiVerison)
    } else {
      log.warn('This package does not support N-API version', napiVerison)
    }
  }
}

/**
 * Issues warnings to the supplied log for those N-API versions not supported
 * by the N-API runtime or the package.
 *
 * Note that this function is specific to the `prebuild` and `prebuild-install`
 * packages.
 *
 * @param {(Array<string>|string)} target The N-API version(s) to check.
 * @param {Object} prebuild An object created by the `prebuild` and
 * `prebuild-install` packages.
 * @param {Object} log The log object to which the warnings are to be issued.
 * Must implement the `warn` method.
 */
exports.logMissingNapiVersions = function (target, prebuild, log) {
  var targets = [].concat(target)
  targets.forEach(function (v) {
    if (!prebuildExists(prebuild, v)) {
      if (exports.packageSupportsVersion(parseInt(v, 10))) {
        log.warn('This Node instance does not support N-API version', v)
      } else {
        log.warn('This package does not support N-API version', v)
      }
    }
  })
}

/**
 * Determines whether a prebuild already exisits for the given N-API version.
  *
 * Note that this function is speicifc to the `prebuild` and `prebuild-install`
 * packages.
*
 * @param {Object} prebuild An object created by the `prebuild` and
 * `prebuild-install` packages.
 * @param {string} napiVersion The N-APi version to be checked.
 * @return {boolean}
 * @private
 */
var prebuildExists = function (prebuild, napiVersion) {
  for (var i = 0; i < prebuild.length; i++) {
    if (prebuild[i].target === napiVersion) return true
  }
  return false
}

/**
 * Returns the best N-APi version to build given the highest N-API
 * version supported by the current Node instance and the N-API versions
 * supported by the package, or undefined if a suitable N-API version
 * cannot be determined.
 *
 * The best build version is the greatest N-API version supported by
 * the package that is less than or equal to the highest N-API version
 * supported by the current Node instance.
 *
 * @returns {number|undefined}
 */
exports.getBestNapiBuildVersion = function () {
  var bestNapiBuildVersion = 0
  var napiBuildVersions = exports.getNapiBuildVersions(pkg)
  if (napiBuildVersions) {
    var ourNapiVersion = exports.getNapiVersion()
    napiBuildVersions.forEach(function (napiBuildVersion) {
      if (napiBuildVersion > bestNapiBuildVersion &&
        napiBuildVersion <= ourNapiVersion) {
        bestNapiBuildVersion = napiBuildVersion
      }
    })
  }
  return bestNapiBuildVersion === 0 ? undefined : bestNapiBuildVersion
}

/**
 * Returns an array of N-APi versions supported by the package.
 *
 * @returns {Array<string>}
 */
exports.getNapiBuildVersions = function () {
  var napiBuildVersions = []
  // remove duplicates, convert to text
  if (pkg.binary && pkg.binary.napi_versions) {
    pkg.binary.napi_versions.forEach(function (napiVersion) {
      var duplicated = napiBuildVersions.indexOf('' + napiVersion) !== -1
      if (!duplicated) {
        napiBuildVersions.push('' + napiVersion)
      }
    })
  }
  return napiBuildVersions.length ? napiBuildVersions : undefined
}

/**
 * Returns the highest N-API version supported by the current node instance
 * or undefined if N-API is not supported.
 *
 * @returns {number|undefined}
 */
exports.getNapiVersion = function () {
  var version = process.versions.napi // can be undefined
  if (!version) { // this code should never need to be updated
    if (versionArray[0] === 9 && versionArray[1] >= 3) version = 2 // 9.3.0+
    else if (versionArray[0] === 8) version = 1 // 8.0.0+
  }
  return version
}
