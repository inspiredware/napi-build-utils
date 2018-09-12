/* global describe, it */

// const assert = require('assert')
const chai = require('chai')
const utils = require('../index')
const path = require('path')
const manifest = require(path.resolve('package.json'))

chai.should()
chai.expect()

describe('napi-build-utils', function () {
  it('manifest validates', function () {
    manifest.should.have.property('binary')
    manifest.binary.should.have.property('for_testing_purposes')
    manifest.binary.should.have.property('napi_versions')
    manifest.binary.napi_versions.should.be.instanceof(Array)
    manifest.binary.napi_versions.length.should.equal(3)
  })
  it('isNapiRuntime', () => {
    var isNapi = utils.isNapiRuntime('napi')
    isNapi.should.equal(true)
    isNapi = utils.isNapiRuntime('n-api')
    isNapi.should.equal(false)
  })
  it('getNapiVersion', function () {
    var napiVersion = utils.getNapiVersion()
    if (process.versions.napi) {
      napiVersion.should.equal(process.versions.napi)
    } else {
      napiVersion.should.satisfy(function (val) {
        return val === undefined || val === '1' || val === '2'
      })
    }
  })
  it('getNapiBuildVersions', function () {
    var buildVersions = utils.getNapiBuildVersions()
    buildVersions.should.be.instanceof(Array)
    buildVersions.length.should.equal(2)
    buildVersions[0].should.equal('2')
    buildVersions[1].should.equal('3')
  })
  it('packageSupportsVersion', function () {
    utils.packageSupportsVersion(1).should.equal(false)
    utils.packageSupportsVersion(2).should.equal(true)
    utils.packageSupportsVersion(3).should.equal(true)
    utils.packageSupportsVersion(4).should.equal(false)
  })
  it('isSupportedVersion', function () {
    var napiVersion = utils.getNapiVersion()
    if (napiVersion === '2' || napiVersion === '3') {
      utils.isSupportedVersion('1').should.equal(false)
      utils.isSupportedVersion('2').should.equal(napiVersion >= 2)
      utils.isSupportedVersion('3').should.equal(napiVersion >= 3)
      utils.isSupportedVersion('4').should.equal(false)
    } else {
      utils.isSupportedVersion('1').should.equal(false)
      utils.isSupportedVersion('2').should.equal(false)
      utils.isSupportedVersion('3').should.equal(false)
      utils.isSupportedVersion('4').should.equal(false)
    }
  })
  it('getBestNapiBuildVersion', function () {
    var napiVersion = parseInt(utils.getNapiVersion(), 10)
    var bestBuildVersion = parseInt(utils.getBestNapiBuildVersion(), 10)
    if (napiVersion < 2) {
      bestBuildVersion.should.equal(undefined)
    } else if (napiVersion === 2) {
      bestBuildVersion.should.equal(2)
    } else if (napiVersion === 3) {
      bestBuildVersion.should.equal(3)
    } else {
      bestBuildVersion.should.equal(undefined)
    }
  })
  it('logUnsupportedVersion', function () {
    var log = {
      count: 0,
      warn: function () {
        this.count++
      }
    }
    var napiVersion = parseInt(utils.getNapiVersion(), 10)
    utils.logUnsupportedVersion('1', log)
    log.count.should.equal(1)
    log.count = 0
    utils.logUnsupportedVersion('2', log)
    log.count.should.equal((napiVersion >= 2) ? 0 : 1)
    log.count = 0
    utils.logUnsupportedVersion('3', log)
    log.count.should.equal((napiVersion >= 3) ? 0 : 1)
    log.count = 0
    utils.logUnsupportedVersion('4', log)
    log.count.should.equal(1)
    log.count = 0
  })
  it('logMissingNapiVersions' /*, function () {
  } */)
})
