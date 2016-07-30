var math = require('mathjax-node/lib/mj-page.js'),
    fs = require('fs'),
    through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.pluginError;

const PLUGIN_NAME = "gulp-mathjax-node";
math.start();


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
        throw(new Error("HTML Error - unable to find", regex));
        return false;
    } else {
        match = match[0];
    }

    result.index = string.indexOf(match);
    result.length = match.length;

    return result;
}

function renderHTML() {
    var stream = through.obj(function(file, enc, cb){
        if (file.isBuffer()) {
            var doc = splitHeadBodyTail(file.contents.toString());
            math.typeset({
                html: doc.body,
                format: "TeX",
                renderer: "SVG",
                width: 1,
                // inputs: argv.format,
                // equationNumbers: argv.eqno,
                // singleDollars: !argv.nodollars,
                // useFontCache: !argv.nofontcache,
                // useGlobalCache: !argv.localcache,
                // addPreview: argv.preview,
                // speakText: argv.speech,
                // speakRuleset: argv.speechrules.replace(/^chromevox$/i,"default"),
                // speakStyle: argv.speechstyle,
                // ex: argv.ex, width: argv.width,
                // linebreaks: argv.linebreaks
            }, (result) => {
                if (!result.errors) {
                    file.contents = new Buffer(doc.head + result.html + doc.tail);
                } else {
                    throw(new Error(PLUGIN_NAME + ": " + result.errors.toString() + " in file \"" + file.path + "\""));
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


function renderHTMLLogErrors(){
    try {
        return renderHTML()
    } catch(e) {
        gutil.log(e.message);
    }
}


module.exports = renderHTMLLogErrors;