# Troubleshooting and FAQ

This is a list of common issues or misconceptions regarding [gulp-mathjax-node](https://github.com/cemrajc/gulp-mathjax-node). Solutions and explanations are included under each heading.

### Table of Contents:

* [Where do the output files go?](#outputfiles)
* [Why does it give me weird characters instead of an image?](#noimage)
* [The output is the wrong type? I wanted MathML!](#mathml)
* [I'm using an HTML minifier, but the output isn't minified?](#minifier)
* [There are is no space after my equation, but there is in markdown?](#nospaceafter)
* [It doesn't work. :(](#itsbroken)


<a name="outputfiles"></a>
## Where do the output files go?

There are no output files. In keeping with the spirit of gulp streams, gulp-mathjax-node only manipulates files that pass through it. As such, it will convert equations into an image that is embedded into the HTML. This way, no new files are created. If you are wanting to generate SVG files, then write your equations in separate plain-text files and pipe them through gulp-mathjax-node as shown in one of the examples within the [README](./README.md).

<a name="noimage"></a>
## Why does it give me weird characters instead of an image?

This is probably because you're using the wrong renderer. Make sure that the `renderer` option is either set to `"SVG"` or not set to anything (`"SVG"` is the default renderer).

<a name="mathml"></a>
## The output is the wrong type? I wanted MathML!

A common mistake is using the wrong `renderer` option or misspelling it. Make sure that you're using `"NativeMML" ` instead of something like `"MathML"` or `"MML"`. This is outlined in the 'options' section of the [README](./README.md).

<a name="minifier"></a>
## I'm using an HTML minifier, but the output isn't minified?

Generally, it's wise to be a bit careful with HTMl minifiers. Try minifying the HTML *after* you run it through gulp-mathjax-node, as shown on the example page.

<a name="nospaceafter"></a>
## There are is no space after my equation, but there is in markdown?

If you're not seeing spaces after your inline equations, even though you put one in the original markdown, then one of two things are likely causing the problem:

* Your HTML minifier is compressing whitespace
* Your markdown converter is trying to do stuff with your TeX

If you're using a minifier, make sure the `compressWhitespace` option is set to `false` - otherwise the span we generate will have any leading whitespace trimmed, which is obviously not a desired outcome.

If you *aren't* using a minifier, then the problem might be with your markdown converter. Look at the generated HTML (before you run it through gulp-mathjax-node) and determine if there's still a space after your equation. If there isn't, then consult your markdown generator's documentation to see if there is any way to disable TeX or math parsing.


<a name="itsbroken"></a>
## It doesn't work. :(

Don't fret. If you're certain that gulp-mathjax-node is what you need, but it just doesn't work, then there may be something we've missed. If you think you've found a bug, or a feature doesn't work the way you expect, then [send me an email](cemrajc+gulpmathjaxnode@gmail.com) outlining your issue (and how I can replicate it) and I'll try to respond within a few weeks.


