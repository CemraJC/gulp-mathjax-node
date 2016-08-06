var math   = require("../index.js"),
    fs     = require("fs"),
    gulp   = require("gulp"),
    expect = require("chai").expect;


function checkFilesEqual(path1, path2) {
    try {
        var file1 = fs.readFileSync(path1, {encoding: "utf-8"});
        var file2 = fs.readFileSync(path2, {encoding: "utf-8"});
        return (file1 === file2);
    } catch(e) {
        console.log("> Could not compare files: ", e.code, e.path);
        return false;
    }
}

function flatDelete(dir) {
    var contents = fs.readdirSync(dir);
    for (var i in contents) {
        fs.unlinkSync(dir + contents[i]);
    }
    fs.rmdirSync(dir);
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
            expect(checkFilesEqual(file_paths.exp + fixture, file_paths.tmp + fixture)).to.equal(true);
            cb();
        })
}

var fixtures = {
    svg_inline: "renderer-svg-inline.html",
    svg_display: "renderer-svg-display.html",

    mathml_inline: "renderer-mathml-inline.html",
    mathml_display: "renderer-mathml-display.html",

    default_options:  "options-default.html",

    no_body:  {
        svg: "no-body-svg.html",
        mathml: "no-body-mathml.html"
    },
    no_head:  {
        svg: "no-head-svg.html",
        mathml: "no-head-mathml.html"
    },
    no_html:  {
        svg: "no-html-svg.html",
        mathml: "no-html-mathml.html"
    },
    no_math: "no-math-svg.html",
    no_anything: "no-anything-svg.html",

    linebreaks:  "linebreaks.html",
    remove_jax:  "remove-jax.html",
    add_preview:  "add-preview.html",
    invalid_tex:  "invalid-tex.html",
    ams_numbering:  "ams-numbering.html",
    all_numbering:  "all-numbering.html",
    no_single_dollars:  "no-single-dollars.html"
}

describe("Renderers:", function () {
    describe("SVG", function () {
        it('should render the proper inline SVG', function (done) {
            testImplementation(fixtures.svg_inline, { renderer: "SVG" }, done);
        })
        it('should render the proper display SVG', function (done) {
            testImplementation(fixtures.svg_display, { renderer: "SVG" }, done);
        })
    })
    describe("MathML (NativeMML)", function () {
        it('should render the proper inline MML', function (done) {
            testImplementation(fixtures.mathml_inline, { renderer: "NativeMML" }, done);
        })
        it('should render the proper display MML', function (done) {
            testImplementation(fixtures.mathml_display, { renderer: "NativeMML" }, done);
        })
    })
    describe("None", function () {
        it('should do nothing', function (done) {
            testImplementation(fixtures.no_anything, { renderer: "None" }, done);
        })
    })
})

describe("Testing Options:", function () {
    // describe("linebreaks", function () {
    //     // Does not insert linebreaks by default
    //     it("should insert linebreaks", function (done) {
    //         testImplementation(fixtures.linebreaks, { renderer: "SVG", linebreaks: true }, done);
    //     })
    // })

    // It does no numbering by default
    describe("equationNumbers", function () {
        it("should give 'AMS' numbering, starting from 1", function (done) {
            testImplementation(fixtures.ams_numbering, { renderer: "SVG", equationNumbers: "AMS" }, done);
        })
        it("should number 'all' equations, starting from 1", function (done) {
            testImplementation(fixtures.all_numbering, { renderer: "SVG", equationNumbers: "all" }, done);
        })
    })

    describe("singleDollars", function () {
        // It will parse by default
        it("should not parse the single-dollar delimiter for inline TeX", function (done) {
            testImplementation(fixtures.no_single_dollars, { renderer: "SVG", singleDollars: false }, done);
        })
    })

    describe("removeJax", function () {
        // It removes by default
        it("should keep MathJax <script> tags", function (done) {
            testImplementation(fixtures.remove_jax, { renderer: "SVG", removeJax: false }, done);
        })
    })

    describe("addPreview", function () {
        // Doesn't do this by default
        it("should turn into a MathJax preview, and keep the TeX", function (done) {
            testImplementation(fixtures.add_preview, { renderer: "SVG", addPreview: true }, done);
        })
    })

})

describe("Failures for Gulp Implementation Code:", function () {
    describe("Invalid options object", function () {
        it('should just use what options it can make sense of', function (done) {
            // TODO: Make it emit a non-blocking warning about the "unknown" properties.
            testImplementation(fixtures.default_options, {
                cream: "corn",
                human: "resources",
                isValid: false
            }, done);
        })
    })
    describe("Invalid options type", function () {
        it('should throw an error', function (done) {
            try {
                testImplementation(fixtures.default_options, "An 'options' string.", done);
            } catch(e) {
                done();
                return true;
            }
            throw new Error("Should thow an error about types, but it didn't");
        })
    })
})


describe("Graceful Failures for Input File:", function () {
    describe("No body tag", function () {
        it('should render the proper SVG as normal', function (done) {
            testImplementation(fixtures.no_body.svg, { renderer: "SVG" }, done);
        })
        it('should render the proper MathML as normal', function (done) {
            testImplementation(fixtures.no_body.mathml, { renderer: "NativeMML" }, done);
        })
    })
    describe("No head tag", function () {
        it('should render the proper SVG as normal', function (done) {
            testImplementation(fixtures.no_head.svg, { renderer: "SVG" }, done);
        })
        it('should render the proper MathML as normal', function (done) {
            testImplementation(fixtures.no_head.mathml, { renderer: "NativeMML" }, done);
        })
    })
    describe("No structuring HTML at all", function () {
        it('should render the proper SVG as normal', function (done) {
            testImplementation(fixtures.no_html.svg, { renderer: "SVG" }, done);
        })
        it('should render the proper MathML as normal', function (done) {
            testImplementation(fixtures.no_html.mathml, { renderer: "NativeMML" }, done);
        })
    })
    describe("Invalid TeX", function () {
        it('should emit an error and move on with no extra output', function (done) {
            testImplementation(fixtures.invalid_tex, { renderer: "SVG" }, done);
        })
    })
    describe("Only standard HTML (no math)", function () {
        it('should not touch the file', function (done) {
            testImplementation(fixtures.no_math, { renderer: "SVG" }, done);
        })
    })
    describe("Nothing at all (no math)", function () {
        it('should not touch the file', function (done) {
            testImplementation(fixtures.no_anything, { renderer: "SVG" }, done);
        })
    })
})

after(function () {
    try {
        flatDelete("temp/");
    } catch(e) {
        console.log(e);
    }
})

