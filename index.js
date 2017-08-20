"use strict";

var math = {
        page: require('mathjax-node/lib/mj-page.js'),
        single: require('mathjax-node/lib/mj-single.js')
    },
    fs = require('fs'),
    _ = require('lodash'),
    gutil = require('gulp-util'),
    through = require('through2'),
    PluginError = gutil.PluginError;


// The math algorithm to use will be determined based on if the file looks like html.
math.page.config({
    displayErrors: false
});
math.page.start();
math.single.start();

var PLUGIN_NAME = "gulp-mathjax-node";

module.exports = renderStream;

/*
    Specialised funciton to split HTML into it's head, body and tail components
 */
function splitHeadBodyTail(html) {
    var result = { head: "", body: "", tail: "" };

    try {
        var bodyStats = indexAndLength(html, new RegExp("<body[^>]*>", "i")),
            tailStats = indexAndLength(html, new RegExp("<\/body[^>]*>", "i"));

        result.head = html.slice(0, bodyStats.index + bodyStats.length);
        result.body = html.slice(bodyStats.index + bodyStats.length, tailStats.index);
        result.tail = html.slice(tailStats.index);
    } catch(e) {
        // If we can't find a body tag, we can assume that there isn't one.
        result.body = html;
    }

    return result;
}

function indexAndLength(string, regex) {
    var result = {
        index: 0,
        length: null
    };

    var match = string.match(regex);
    if (match === null || match[0] === undefined) {
        throw(new PluginError(PLUGIN_NAME, "Unable to find " + regex));
        return false;
    } else {
        match = match[0];
    }

    result.index = string.indexOf(match);
    result.length = match.length;

    return result;
}

function parseOptions(_options) {
    _options = _options || {}; // If it's undefined, allow it through (use defaults)

    if (typeof(_options) !== "object") {
        throw new PluginError(PLUGIN_NAME, "Options must be of type 'object', not \'" + typeof(_options) + "\'");
    }

    /*
    *
    *   These options were stolen (and slightly modified) from the MathJax node module itself :)
    *   NOTE: [Not Supported] options will still be passed, but are not officially tested by this plugin.
    *         [Supported] options should work as intended. See the README for more.
    *
    */

    var error_html = "<h1 style='width: 100%;text-align:center;font-family:Arial,sans-serif;'>If you're seeing this, a major error has occurred. Please file an issue at the <a style='color:#67B1E5;' href='https://github.com/cemrajc/gulp-mathjax-node/issues'><b>gulp-mathjax-node</b></a> Github page!</h1>";


    // This merges the options for mj-page and mj-single into one.
    var defaults = {
        html: error_html,               // the HTML snippet to process, which will be overwritten in this
                                        // object by the contents of the file itself,
                                        // so it has an error message in a string.
        math: "Problem!",               // the math to typeset - this will be replaced, so it has a warning message.

        format: "TeX",                  // the input format (TeX, inline-TeX, AsciiMath, or MathML)
        mml: false,                     // return mml output?
        svg: false,                     // return svg output?
        img: false,                     // return img tag for remote image?
        png: false,                     // return png image (as data: URL)?

        linebreaks: false,              // do linebreaking? [Supported]
        equationNumbers: "none",        // or "AMS" or "all" [Supported]
        singleDollars: true,            // allow single-dollar delimiter for inline TeX? [Supported]

        renderer: "SVG",                // the output format [Supported]
                                        //    ("SVG", "NativeMML", "IMG", or "None")

        addPreview: false,              // turn turn into a MathJax preview, and keep the jax [Supported]
        removeJax: true,                // remove MathJax <script> tags? [Supported]

        ex: 6,                          // ex-size in pixels [Not Supported]
        width: 1,                       // width of container (in ex) for linebreaking and tags [Not Supported]
        useFontCache: true,             // use <defs> and <use> in svg output? [Not Supported]
        useGlobalCache: true,           // use common <defs> for all equations? [Not Supported]
        xmlns: "mml",                   // the namespace to use for MathML [Not Supported]
        inputs: ["AsciiMath","TeX","MathML"],  // the inputs formats to support [Not Supported]
        dpi: 144,                       // dpi for png image [Not Supported - Requires Balik or somthing]
        speakText: false,               // add spoken annotations to svg output? [Not Supported]
        speakRuleset: "mathspeak",      // set speech ruleset (default (chromevox rules), mathspeak) [Not Supported]
        speakStyle: "default",          // set speech style (mathspeak:  default, brief, sbrief) [Not Supported]
        timeout: 1 * 1000,             // 60 second timeout before restarting MathJax [Not Supported]
    };

    var options = _.pick(_.defaults(_options, defaults), Object.keys(defaults));

    if (!options.css && !options.mml && !options.svg && !options.img && !options.png) {
        options.svg = true;
    }

    return options;
}

function optionsForPage(options) {
    var accepted_keys = ['html', 'linebreaks', 'equationNumbers', 'singleDollars', 'renderer', 'addPreview', 'extensions',
    'removeJax', 'ex', 'width', 'useFontCache', 'useGlobalCache', 'xmlns', 'inputs', 'dpi', 'speakText', 'speakRuleset', 'speakStyle', 'timeout'];
    return _.pick(options, accepted_keys);
}

function optionsForSingle(options) {
    // Must exclude "useGlobalCache", otherwise mathjax-node says something about glyphs
    var accepted_keys = ['math', 'format', 'mml', 'svg', 'img', 'png', 'linebreaks', 'equationNumbers', 'ex', 'width', 'useFontCache', 'xmlns', 'dpi', 'speakText', 'speakRuleset', 'speakStyle', 'timeout'];
    return _.pick(options, accepted_keys);
}

function checkForTex(html) {
    var searches = [new RegExp("\\${1,2}[^$]*\\${1,2}"), 'script type="math/tex'];
    for (var i in searches) {
        if (html.match(searches[i]) !== null) {
            return true;
        }
    }
    return false;
}

function extractMath(string) {
    var first_dollar = indexAndLength(string, new RegExp("\\${1,2}"));
    string = string.substr(first_dollar.index + first_dollar.length);

    var second_dollar = indexAndLength(string, new RegExp("\\${1,2}"));
    string = string.replace(/\${1,2}.*/, '');
    string = string.replace(/\r?\n/, '');
    string = string.trim();
    return string;
}

function renderStream(_options) {
    var options = parseOptions(_options);

    var stream = through.obj(function(file, enc, cb){
        if (options.renderer == 'none' || options.format == 'none' || !file.isBuffer()) {
            this.push(file);
            cb();
        } else if (checkForTex(file.contents.toString())) {
            if (file.contents.toString().match(/<[^<]+>/) !== null) {
                renderPage.call(this, file, optionsForPage(options), cb);
            } else {
                renderSingle.call(this, file, optionsForSingle(options), cb);
            }
        } else {
            this.push(file);
            cb();
        }
    });
    return stream;
}

function renderPage(file, options, cb) {
    var doc = splitHeadBodyTail(file.contents.toString());
    if (checkForTex(doc.body)) {
        options.html = doc.body;

        var stream_parent = this;
        math.page.typeset(options, function (result) {
            if (!result.errors) {
                file.contents = new Buffer(doc.head + result.html + doc.tail);
            } else {
                stream_parent.emit(new PluginError(PLUGIN_NAME, result.errors.toString() + " in file \"" + file.path + "\""));
            }
            stream_parent.push(file);
            cb();
        });
    } else {
        this.push(file);
        cb();
    }
}

function renderSingle(file, options, cb) {
    var method;
    options.math = extractMath(file.contents.toString());

    var methods = _.pick(options, ['mml', 'svg', 'img', 'png']);
    for (var i in methods) {
        if (methods[i]) {
            method = i;
            break;
        }
    }

    var stream_parent = this;
    math.single.typeset(options, function (result) {
        if (!result.errors) {
            file.contents = new Buffer(result[method]);
        } else {
            stream_parent.emit(new PluginError(PLUGIN_NAME, result.errors.toString() + " in file \"" + file.path + "\""));
        }
        stream_parent.push(file);
        cb();
    });
}

