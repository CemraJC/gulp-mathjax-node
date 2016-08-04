var math = require("../index.js"),
    expect = require("chai").expect;


/*

    TODO:
    Add checks to make sure each of the options are working

 */



describe("Renderer:", function(){
    describe("SVG", function(){
        it('should render the proper inline SVG', function() {
            expect(false).to.be(true);
        })
        it('should render the proper display SVG', function() {
            expect(false).to.be(true);
        })
    })
    describe("MathML", function(){
        it('should render the proper inline MML', function() {
            expect(false).to.equal(true);
        })
        it('should render the proper display MML', function() {
            expect(false).to.equal(true);
        })
    })
})

describe("Graceful Failures for Gulp implementation:", function(){
    describe("Invalid options object", function(){
        it('should emit an error and use the defaults', function(){
            expect(false).to.equal(true);
        })
    })
    describe("Invalid options type", function(){
        it('should emit an error and use the defaults', function(){
            expect(false).to.equal(true);
        })
    })
})


describe("Graceful Failures for Input File:", function(){
    describe("No body tag", function(){
        it('should render the proper SVG as normal', function() {
            expect(false).to.equal(true);
        })
        it('should render the proper MathML as normal', function() {
            expect(false).to.equal(true);
        })
    })
    describe("No head tag", function(){
        it('should render the proper SVG as normal', function() {
            expect(false).to.equal(true);
        })
        it('should render the proper MathML as normal', function() {
            expect(false).to.equal(true);
        })
    })
    describe("No structuring HTML at all", function(){
        it('should render the proper SVG as normal', function() {
            expect(false).to.equal(true);
        })
        it('should render the proper MathML as normal', function() {
            expect(false).to.equal(true);
        })
    })
    describe("Invalid TeX", function(){
        it('should emit an error and move on', function() {
            expect(false).to.equal(true);
        })
        it('should still render valid math', function() {
            expect(false).to.equal(true);
        })
    })
    describe("Only standard HTML (no math)", function(){
        it('should not touch the file', function() {
            expect(false).to.equal(true);
        })
    })
    describe("Nothing at all (no math)", function(){
        it('should not touch the file', function() {
            expect(false).to.equal(true);
        })
    })
})