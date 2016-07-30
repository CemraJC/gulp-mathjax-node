# gulp-mathjax-node

gulp-mathjax-node is a [gulp](https://github.com/wearefractal/gulp) plugin to statically render TeX expressions into markup.

gulp-mathjax-node is a wrapper around the [mathjax-node]() module.

For example, if you had an HTML file with TeX in it like this:

``` html
<body>
  <p>G'day mate! Here's a math expression:</p>
  $$ \int^\pi_0 sin\left( \frac{x^2}{2} \right) dx $$  <-- Are you sure?
  <p>This is an HTML file!</p>
</body>
```


The output (in a browser) would *look* like this:

----

G'day mate! Here's a math expression:

![Equation SVG Demo](images/demo.svg)

This is an HTML file!

----

Note however, that the SVG definition is actually inline with the HTML.


<!-- [![NPM](https://nodei.co/npm/gulp-mathjax-node.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-mathjax-node/)

[![build status](https://secure.travis-ci.org/cemrajc/gulp-mathjax-node.svg)](http://travis-ci.org/cemrajc/gulp-mathjax-node)
[![devDependency Status](https://david-dm.org/cemrajc/gulp-mathjax-node/dev-status.svg)](https://david-dm.org/cemrajc/gulp-mathjax-node#info=devDependencies) -->

## Usage

gulp-mathjax-node can be simply dropped in to an HTML processing pipeline.

```javascript
var math     = require("gulp-mathjax-node"),
    htmlmin  = require("gulp-htmlmin"), // This is for demonstration
    kramdown = require("gulp-kramdown"); // This is also for demonstration

// Convert markdown to html, then inline-render any TeX expressions
gulp.src("**/*.{md, markdown}")
  .pipe(kramdown())
  .pipe(math())
  .pipe(gulp.dest("dest/"));

// Inline-render equations in every html file.
// NOTE! This will overwrite the files where they stand
gulp.src("_site/**/*.html")
  .pipe(math())
  .pipe(htmlmin())
  .pipe(gulp.dest("_site/"));
```

gulp-mathjax-node also accepts custom options, which are passed directly into mathjax-node.

```javascript
var math = require("gulp-mathjax-node");

// Inline-render equations in every html file as MathML
gulp.src("**/*.html")
  .pipe(math({
    renderer: "MML"
  }))
  .pipe(gulp.dest("dest/"));
```

### Summary of Default Behaviour

By default, gulp-mathjax-node takes in HTML with TeX expressions and spits out HTML again but with inlined SVGs instead of TeX.

## Options

So far, the only supported options you can change are to do with the format which the TeX is rendered to.
There are other options you can pass in, but you will need to refer to the [mathjax-node]() docs to find out what they are. Be warned, they may not work as you intend.


## Notes

* The HTML files should have `<body>` tags. If it does not, then the result may not be what you expected.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
