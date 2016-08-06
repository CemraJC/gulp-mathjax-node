var math   = require("../index.js"),
    fs     = require("fs"),
    gulp   = require("gulp"),
    expect = require("chai").expect;


/*

    TODO:
    Add checks to make sure each of the options are working

 */


function checkEqual(path1, path2) {
    try {
        file1 = fs.readFileSync(path1, {encoding: "utf-8"});
        file2 = fs.readFileSync(path2, {encoding: "utf-8"});
        return (file1 === file2);
    } catch(e) {
        console.log("> Could not compare files: ", e.code, e.path);
        return false;
    }
}

function testImplementation(fixture, options, cb) {
    var file_paths = {
        src: "fixtures/",
        exp: "expected/",
        tmp: "temp/"
    }

    gulp.src(file_paths.src + fixture)
        .pipe(math(options))
        .pipe(gulp.dest(file_paths.tmp))
        .on('end', function() {
            expect(checkEqual(file_paths.exp + fixture, file_paths.tmp + fixture)).to.equal(true);
            try {
                // fs.unlinkSync(file_paths.tmp + fixtures.svg_inline);
            } catch(e) { }
            cb();
        })
}

var fixtures = {
    svg_inline: "renderer-svg-inline.html",
    svg_display: "renderer-svg-display.html",

    mathml_inline: "renderer-mathml-inline.html",
    mathml_display: "renderer-mathml-display.html",

    invalid_opts_obj: "options-default.html",
    default_options:  "options-default.html",

    no_body:  "no-body.html",
    no_head:  "no-head.html",
    no_html:  "no-html.html",
    no_math:  "no-math.html",
    no_anything:  "no-anything.html",

    invalid_tex:  "invalid-tex.html",
    mixed_invalid_tex:  "mixed-invalid-tex.html"
}

// describe("Renderers:", function() {
//     describe("SVG", function() {
//         it('should render the proper inline SVG', function(callback) {
//             testImplementation(fixtures.svg_inline, { renderer: "SVG" }, callback);
//         })
//         it('should render the proper display SVG', function(callback) {
//             testImplementation(fixtures.svg_display, { renderer: "SVG" }, callback);
//         })
//     })
//     describe("MathML (NativeMML)", function() {
//         it('should render the proper inline MML', function(callback) {
//             testImplementation(fixtures.mathml_inline, { renderer: "NativeMML" }, callback);
//         })
//         it('should render the proper display MML', function(callback) {
//             testImplementation(fixtures.mathml_display, { renderer: "NativeMML" }, callback);
//         })
//     })
// })

describe("Graceful Failures for Gulp implementation:", function() {
    describe("Invalid options object", function() {
        it('should just use what options it can make sense of', function(callback) {
            // TODO: Make it emit a non-blocking warning about the "unknown" properties.
            testImplementation(fixtures.invalid_opts_obj, {
                cream: "corn",
                human: "resources",
                isValid: false
            }, callback);
        })
    })
    describe("Invalid options type", function() {
        it('should throw an error', function(callback) {
            try {
                testImplementation(fixtures.default_options, "An 'options' string.", callback);
            } catch(e) {
                callback();
                return true;
            }
            throw new Error("Should thow an error about types, but it didn't");
        })
    })
})


// describe("Graceful Failures for Input File:", function() {
//     describe("No body tag", function() {
//         it('should render the proper SVG as normal', function(callback) {
//             testImplementation(fixtures.no_body, { renderer: "SVG" }, callback);
//         })
//         it('should render the proper MathML as normal', function(callback) {
//             testImplementation(fixtures.no_body, { renderer: "NativeMML" }, callback);
//         })
//     })
//     describe("No head tag", function() {
//         it('should render the proper SVG as normal', function(callback) {
//             testImplementation(fixtures.no_head, { renderer: "SVG" }, callback);
//         })
//         it('should render the proper MathML as normal', function(callback) {
//             testImplementation(fixtures.no_head, { renderer: "NativeMML" }, callback);
//         })
//     })
//     describe("No structuring HTML at all", function() {
//         it('should render the proper SVG as normal', function(callback) {
//             testImplementation(fixtures.no_html, { renderer: "SVG" }, callback);
//         })
//         it('should render the proper MathML as normal', function(callback) {
//             testImplementation(fixtures.no_html, { renderer: "NativeMML" }, callback);
//         })
//     })
//     describe("Invalid TeX", function() {
//         it('should emit an error and move on', function(callback) {
//             testImplementation(fixtures.invalid_tex, { renderer: "SVG" }, callback);
//         })
//         it('should still render the valid math', function(callback) {
//             testImplementation(fixtures.mixed_invalid_tex, { renderer: "SVG" }, callback);
//         })
//     })
//     describe("Only standard HTML (no math)", function() {
//         it('should not touch the file', function(callback) {
//             testImplementation(fixtures.no_math, { renderer: "SVG" }, callback);
//         })
//     })
//     describe("Nothing at all (no math)", function() {
//         it('should not touch the file', function(callback) {
//             testImplementation(fixtures.no_anything, { renderer: "SVG" }, callback);
//         })
//     })
// })