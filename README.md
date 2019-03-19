# htmllint extension for Fepper

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
