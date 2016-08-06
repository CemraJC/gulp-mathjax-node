var math = require('mathjax-node/lib/mj-page.js'),
    fs = require('fs'),
    _ = require('lodash'),
    gutil = require('gulp-util'),
    through = require('through2'),
    PluginError = gutil.PluginError;

const PLUGIN_NAME = "gulp-mathjax-node";


/*

TODO:
CHECK IF THEY ACTUALLY HAVE TEX!!!

 */

/*
    Specialised funciton to split HTML into it's head, body and tail components
 */
function splitHeadBodyTail(html) {
    var bodyStats = indexAndLength(html, new RegExp("<body[^>]*>", "i")),
        tailStats = indexAndLength(html, new RegExp("<\/body[^>]*>", "i"));

    var result = { head: "", body: "", tail: "" };

    result.head = html.slice(0, bodyStats.index + bodyStats.length);
    result.body = html.slice(bodyStats.index + bodyStats.length, tailStats.index);
    result.tail = html.slice(tailStats.index);

    return result;
}

function indexAndLength(string, regex) {
    var result = {
        index: 0,
        length: null
    };

    var match = string.match(regex);
    if (match === null || match[0] === undefined) {
        throw(new PluginError(PLUGIN_NAME, "HTML Error - unable to find" + regex));
        return false;
    } else {
        match = match[0];
    }

    result.index = string.indexOf(match);
    result.length = match.length;

    return result;
}

function parseOptions(_options) {

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

    var defaults = {
        html: error_html,               // the HTML snippet to process, which will be overwritten in this
                                        // object by the contents of the file itself,
                                        // so it has an error message in a string.

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
        timeout: 60 * 1000,             // 60 second timeout before restarting MathJax [Not Supported]
    };

    var options = _.defaults(_.pick(_options, defaults), defaults);

    return options;
}

function renderHTML(_options) {

    var options = parseOptions(_options);

    var stream = through.obj(function(file, enc, cb){
        if (file.isBuffer()) {
            var doc = splitHeadBodyTail(file.contents.toString());
            options.html = doc.body;
            math.start();

            math.typeset(options, (result) => {
                if (!result.errors) {
                    file.contents = new Buffer(doc.head + result.html + doc.tail);
                } else {
                    throw(new PluginError(PLUGIN_NAME, result.errors.toString() + " in file \"" + file.path + "\""));
                }
                this.push(file);
                cb();
            });
        } else {
            this.push(file);
            cb();
        }
    });

    return stream;
}


module.exports = renderHTML;