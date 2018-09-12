/* global describe, before, it */

// const assert = require('assert')
const chai = require('chai')
const utils = require('../index')
const path = require('path')
const manifest = require(path.resolve('package.json'))

let napiVersion = utils.getNapiVersion()
console.log('Node v' + process.versions.node + ' - ' +
            'N-API v' + napiVersion + ' - ' +
            'process.versions.napi ' + process.versions.napi)

chai.should()
chai.expect()

describe('napi-build-utils', function () {
  before('manifest validates', function () {
    manifest.should.have.property('binary')
    manifest.binary.should.have.property('note')
    manifest.binary.should.have.property('napi_versions')
    manifest.binary.napi_versions.should.be.instanceof(Array)
    manifest.binary.napi_versions.length.should.equal(3)
  })
  it('isNapiRuntime', () => {
    let isNapi = utils.isNapiRuntime('napi')
    isNapi.should.equal(true)
    isNapi = utils.isNapiRuntime('n-api')
    isNapi.should.equal(false)
  })
  it('getNapiVersion', function () {
    if (process.versions.napi) {
      napiVersion.should.equal(process.versions.napi)
    } else {
      napiVersion.should.satisfy(function (val) {
        return val === undefined || val === '1' || val === '2'
      })
    }
  })
  it('getNapiBuildVersions', function () {
    let buildVersions = utils.getNapiBuildVersions()
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
    let napiVersion = parseInt(utils.getNapiVersion(), 10)
    let bestBuildVersion = parseInt(utils.getBestNapiBuildVersion(), 10)
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
    let napiVersion = parseInt(utils.getNapiVersion(), 10)
    unsupportedLog('1').length.should.equal(1)
    unsupportedLog('2').length.should.equal((napiVersion >= 2) ? 0 : 1)
    unsupportedLog('3').length.should.equal((napiVersion >= 3) ? 0 : 1)
    unsupportedLog('4').length.should.equal(1)
  })
  it('logMissingNapiVersions', function () {
    let napiVersion = parseInt(utils.getNapiVersion(), 10)
    let prebuild = []
    if (napiVersion >= 2) prebuild.push({ runtime: 'napi', target: '2' })
    if (napiVersion >= 3) prebuild.push({ runtime: 'napi', target: '3' })
    missingLog('1', prebuild).length.should.equal(1)
    missingLog('2', prebuild).length.should.equal((napiVersion >= 2) ? 0 : 1)
    missingLog('3', prebuild).length.should.equal((napiVersion >= 3) ? 0 : 1)
    missingLog('4', prebuild).length.should.equal(1)
  })
})

function unsupportedLog (napiVersion) {
  let log = {
    contents: [],
    warn: function (msg) {
      this.contents.push(msg)
    }
  }
  utils.logUnsupportedVersion(napiVersion, log)
  return log.contents
}

function missingLog (target, prebuild) {
  let log = {
    contents: [],
    warn: function (msg) {
      this.contents.push(msg)
    }
  }
  utils.logMissingNapiVersions(target, prebuild, log)
  return log.contents
}
