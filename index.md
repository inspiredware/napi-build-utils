<a name="module_napi-build-utils"></a>

## napi-build-utils
A set of utilities to assist developers of tools building
[N-API](https://nodejs.org/api/n-api.html#n_api_n_api) native add-ons.

The main repository can be found [here](https://github.com/inspiredware/napi-build-utils).


* [napi-build-utils](#module_napi-build-utils)
    * [.isNapiRuntime()](#module_napi-build-utils.isNapiRuntime) ⇒ <code>boolean</code>
    * [.isSupportedVersion()](#module_napi-build-utils.isSupportedVersion) ⇒ <code>boolean</code>
    * [.logUnsupportedVersion(napiVerison, log)](#module_napi-build-utils.logUnsupportedVersion)
    * [.logMissingNapiVersions(target, prebuild, log)](#module_napi-build-utils.logMissingNapiVersions)
    * [.getBestNapiBuildVersion()](#module_napi-build-utils.getBestNapiBuildVersion) ⇒ <code>number</code> \| <code>undefined</code>
    * [.getNapiBuildVersions()](#module_napi-build-utils.getNapiBuildVersions) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getNapiVersion()](#module_napi-build-utils.getNapiVersion) ⇒ <code>number</code> \| <code>undefined</code>

<a name="module_napi-build-utils.isNapiRuntime"></a>

### napi-build-utils.isNapiRuntime() ⇒ <code>boolean</code>
Implements a consistent name of `napi` for N-API runtimes.

**Kind**: static method of [<code>napi-build-utils</code>](#module_napi-build-utils)  
**Poram**: <code>string</code> runtime The runtime string.  
<a name="module_napi-build-utils.isSupportedVersion"></a>

### napi-build-utils.isSupportedVersion() ⇒ <code>boolean</code>
Determines whether the specified N-API version is supported
by both the currently running Node instance and the package.

**Kind**: static method of [<code>napi-build-utils</code>](#module_napi-build-utils)  
**Poram**: <code>string</code> napiVerison The N-API version to check.  
<a name="module_napi-build-utils.logUnsupportedVersion"></a>

### napi-build-utils.logUnsupportedVersion(napiVerison, log)
Issues a warning to the supplied log if the N-API version is not supported
by the current Node instance or if the N-API version is not supported
by the package.

**Kind**: static method of [<code>napi-build-utils</code>](#module_napi-build-utils)  

| Param | Type | Description |
| --- | --- | --- |
| napiVerison | <code>string</code> | The N-API version to check. |
| log | <code>Object</code> | The log object to which the warnings are to be issued. Must implement the `warn` method. |

<a name="module_napi-build-utils.logMissingNapiVersions"></a>

### napi-build-utils.logMissingNapiVersions(target, prebuild, log)
Issues warnings to the supplied log for those N-API versions not supported
by the N-API runtime or the package.

Note that this function is specific to the `prebuild` and `prebuild-install`
packages.

**Kind**: static method of [<code>napi-build-utils</code>](#module_napi-build-utils)  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Array.&lt;string&gt;</code> \| <code>string</code> | The N-API version(s) to check. |
| prebuild | <code>Object</code> | An object created by the `prebuild` and `prebuild-install` packages. |
| log | <code>Object</code> | The log object to which the warnings are to be issued. Must implement the `warn` method. |

<a name="module_napi-build-utils.getBestNapiBuildVersion"></a>

### napi-build-utils.getBestNapiBuildVersion() ⇒ <code>number</code> \| <code>undefined</code>
Returns the best N-APi version to build given the highest N-API
version supported by the current Node instance and the N-API versions
supported by the package, or undefined if a suitable N-API version
cannot be determined.

The best build version is the greatest N-API version supported by
the package that is less than or equal to the highest N-API version
supported by the current Node instance.

**Kind**: static method of [<code>napi-build-utils</code>](#module_napi-build-utils)  
<a name="module_napi-build-utils.getNapiBuildVersions"></a>

### napi-build-utils.getNapiBuildVersions() ⇒ <code>Array.&lt;string&gt;</code>
Returns an array of N-APi versions supported by the package.

**Kind**: static method of [<code>napi-build-utils</code>](#module_napi-build-utils)  
<a name="module_napi-build-utils.getNapiVersion"></a>

### napi-build-utils.getNapiVersion() ⇒ <code>number</code> \| <code>undefined</code>
Returns the highest N-API version supported by the current node instance
or undefined if N-API is not supported.

**Kind**: static method of [<code>napi-build-utils</code>](#module_napi-build-utils)  
