# htmllint extension for Fepper

[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Linux Build Status][linux-image]][linux-url]
[![Mac Build Status][mac-image]][mac-url]
[![Windows Build Status][windows-image]][windows-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]

This extension will lint the HTML in your `public/patterns` directory.

### Install

```bash
cd extend
npm i --save-dev fp-htmllint
```

### Use

Add this tasks to `extend/contrib.js`

* Under gulp task 'contrib:once'
  * 'htmllint'

On the command line:

```shell
fp htmllint
```

On installation, a `.htmllintrc` file will be copied into your project's current 
working directory. Customize it to the needs of your project: 
<a href="https://github.com/htmllint/htmllint/wiki/Options" target="_blank">
htmllint options</a>.

You can customize further by writing 
<a href="https://github.com/yvanavermaet/gulp-htmllint#options" target="_blank">
additional gulp-htmllint options</a>
to your `pref.yml` file. 

```yaml
htmllint:
  config: another/location/.htmllintrc
  failOnError: true
```

[snyk-image]: https://snyk.io/test/github/electric-eloquence/fp-htmllint/master/badge.svg
[snyk-url]: https://snyk.io/test/github/electric-eloquence/fp-htmllint/master

[linux-image]: https://github.com/electric-eloquence/fp-htmllint/workflows/Linux%20build/badge.svg?branch=master
[linux-url]: https://github.com/electric-eloquence/fp-htmllint/actions?query=workflow%3A"Linux+build"

[mac-image]: https://github.com/electric-eloquence/fp-htmllint/workflows/Mac%20build/badge.svg?branch=master
[mac-url]: https://github.com/electric-eloquence/fp-htmllint/actions?query=workflow%3A"Mac+build"

[windows-image]: https://github.com/electric-eloquence/fp-htmllint/workflows/Windows%20build/badge.svg?branch=master
[windows-url]: https://github.com/electric-eloquence/fp-htmllint/actions?query=workflow%3A"Windows+build"

[coveralls-image]: https://img.shields.io/coveralls/electric-eloquence/fp-htmllint/master.svg
[coveralls-url]: https://coveralls.io/r/electric-eloquence/fp-htmllint

[license-image]: https://img.shields.io/github/license/electric-eloquence/fp-htmllint.svg
[license-url]: https://raw.githubusercontent.com/electric-eloquence/fp-htmllint/master/LICENSE
