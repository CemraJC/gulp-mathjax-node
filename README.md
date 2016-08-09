# gulp-mathjax-node

gulp-mathjax-node is a [gulp](https://github.com/gulpjs/gulp) plugin to statically render TeX expressions into markup or images. More specifically, this plugin is a wrapper around the [mathjax-node](https://github.com/mathjax/MathJax-node) module.

For example, if you had an HTML file with TeX in it like this:

``` html
<body>
  <p>This is an HTML file!</p>
  <p>G'day mate! Here's a math expression:</p>
  $$
    \int^\pi_0 sin\left( \frac{x^2}{2} \right) dx
  $$
  <p>Try a good 'ol inline expression: $x^2+y^2=z^2$</p>
</body>
```


The output (in a browser) would *look* like this:

----

This is an HTML file!

G'day mate! Here's a math expression:

![Display Equation SVG Demo](images/demo_display.svg)

Try a good 'ol inline expression: ![Inline Equation SVG Demo](images/demo_inline.svg)

----

Note however, that the SVG definition is actually inline with the HTML (and the inline equation wouldn't be cut off).


<!-- [![NPM](https://nodei.co/npm/gulp-mathjax-node.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-mathjax-node/)

[![build status](https://secure.travis-ci.org/cemrajc/gulp-mathjax-node.svg)](http://travis-ci.org/cemrajc/gulp-mathjax-node)
[![devDependency Status](https://david-dm.org/cemrajc/gulp-mathjax-node/dev-status.svg)](https://david-dm.org/cemrajc/gulp-mathjax-node#info=devDependencies) -->

## Usage

#### HTML Files

gulp-mathjax-node can be simply dropped in to an HTML processing pipeline - although other file formats could be used.

```javascript
var math     = require("gulp-mathjax-node"),
    gulp     = require("gulp"),
    htmlmin  = require("gulp-htmlmin"),       // This is for demonstration - not needed
    kramdown = require("gulp-kramdown");      // This is also for demonstration and not needed


/*
  Convert markdown to html, then inline-render any TeX expressions and dump results in "dest/"
*/

gulp.src("**/*.{md, markdown}")
  .pipe(kramdown())
  .pipe(math())
  .pipe(gulp.dest("dest/"));


/*
  Inline-render equations in every html file, then minify and output to "_site/"
  WARNING! This will overwrite the html files where they stand.
*/
gulp.src("_site/**/*.html")
  .pipe(math())
  .pipe(htmlmin())
  .pipe(gulp.dest("_site/"));
```

gulp-mathjax-node also accepts custom options, which are passed directly into [mathjax-node](https://github.com/mathjax/MathJax-node).

```javascript
var math = require("gulp-mathjax-node"),
    gulp = require("gulp");

// Inline-render numbered equations in every html file as Native MathML
gulp.src("**/*.html")
  .pipe(math({
    renderer: "NativeMML",
    equationNumbers: "all"
  }))
  .pipe(gulp.dest("dest/"));
```

#### TeX Files

As mentioned before, HTML isn't the only filetype supported. Any plaintext file with TeX in it can be converted. Make sure that you use double-dollar signs.

**Input:**

```latex
% This file is "equation.tex". Anything between the $$'s gets rendered, the rest is completely ignored.
$$
  h(\pi\timesr_1^2 - \pi\timesr_2^2)
$$
```

**Processing Logic:**

```javascript
var math   = require("gulp-mathjax-node"),
    rename = require("gulp-rename"),
    gulp   = require("gulp");

// Render a plaintext equation into an SVG.
gulp.src("equation.tex")
  .pipe(math({
    svg: true
  }))
  .pipe(rename({
    extname: ".svg"
  }))
  .pipe(gulp.dest("dest/"));
```

**Output:**

![Plain TeX to SVG](./images/demo_plain.svg)

# Options

Options must be passed in as a json object, similar to the examples above. Depending on what kind of files you're handling, the options will vary.

## HTML Files

These options only apply when the files you're using *look* like HTML. This means that any file with something like a tag in it (like this: `<an non standard tag>`) will be rendered using this pipeline with the following options.

#### renderer

Type: "String" <br>
Default: `SVG`

Accepted Values:

* `SVG` - Render equations as an SVG image (as demonstrated above)
* `NativeMML` - Render equations into Math Markup Language
* `None` - Not sure why you'd want this, but it will completely disable equation rendering and just pass the file through

#### equationNumbers

Type: "String"<br>
Default: `none`

Accepted Values:

* `AMS` - Any display equations written inside a `$$\begin{equation} ... \end{equation}$$` block will be numbered.
* `all` - Every display equation will be numbered, starting from 1.
* `none` - Doesn't number any equations

#### singleDollars

Type: Boolean <br>
Default: `true`

If `true`, allow inline TeX expressions to be written as `$ ... $`

#### removeJax

Type: Boolean <br>
Default: `true`

If `true`, remove the TeX expression from the markup after replacing them.

#### addPreview

Type: Boolean <br>
Default: `false`

If `true`, add a MathJaX preview clause and keep the TeX. If you still want to use a dynamic MathJaX script, this is a great way to boost the perceived performance.



## TeX Files

These options apply to files that don't look like HTML. If you want the file to be rendered, it is required that the target expression is enclosed in a pair of dollar signs, as shown in the example before. Everything else in the file is ignored, while the enclosed expression is rendered by mathjax-node.


#### format

Type: String <br>
Default: `TeX`

* `TeX` - The input is written in TeX
* `inline-TeX` - The input is TeX, but is meant to be inline
* `MathML` - The input it MathML
* `AsciiMath` - The input is in the AsciiMath format

#### svg

Type: Boolean <br>
Default: `true`

If `true`, render the math expression to an svg.


#### mml

Type: Boolean <br>
Default: `false`

If `true`, render the math expression to mml.

##### Renderer Warning

If you set more than one of `svg` or `mml` to true, then the behavior is undefined.

<!-- #### linebreaks

Type: Boolean <br>
Default: `false`

If `true`, we don't actually know what happens. -->



### Note about option support

There are other options you can pass in, but you will need to refer to the [mathjax-node docs](https://github.com/mathjax/MathJax-node/README.md) to find out what they are. Be warned, if they aren't mentioned above, they may not work as you intend.

gulp-mathjax-node only supports a few of the options that the underlying [mathjax-node](https://github.com/mathjax/MathJax-node) module can actually handle. Mostly, this is of little consequence (let us know if we've made an oversight), but the most notable exclusion is PNG-rendering support. This PNG renderer is not supported, because mathjax-node does not actually include the capability for PNG rendering - it requires a separate manually-installed library. In my opinion, the SVG renderer is better anyway, because resulting equations look crisp at any dpi. The basic SVGs that mathjax-node produces are also [highly supported](http://caniuse.com/svg).

## Troubleshooting

Refer to the [troubleshooting document](./TROUBLESHOOTING.md) for a list of common problems and known solutions.

## License

Released under the [MIT License](http://en.wikipedia.org/wiki/MIT_License)
