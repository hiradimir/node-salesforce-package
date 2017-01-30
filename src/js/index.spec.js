"use strict";
var index_1 = require("./index");
var assert = require("assert");
describe("PackageXMLGenerater", function () {
    describe("constructor", function () {
        var generater;
        beforeEach(function () {
            generater = new index_1.PackageXMLGenerater({ sfdcPackage: { Package: { version: "38.0" } } });
        });
        it("can change version by constructor argument sfdcPackage.Package.version", function () {
            assert.equal(generater.sfdcPackage.Package.version, "38.0");
        });
        it("not changes no value on constructor argument sfdcPackage.Package", function () {
            assert.equal(generater.sfdcPackage.Package["@xmlns"], "http://soap.sforce.com/2006/04/metadata");
        });
        it("can generate empty package.xml with select version", function () {
            var xml = generater.toXML();
            assert.equal(xml, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n    <types/>\n    <version>38.0</version>\n</Package>\n");
        });
    });
});
//# sourceMappingURL=index.spec.js.map