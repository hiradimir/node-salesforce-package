"use strict";
var index_1 = require("./index");
var assert = require("assert");
describe("PackageXMLGenerater", function () {
    describe("constructor", function () {
        var generater;
        describe("with no args", function () {
            beforeEach(function () {
                generater = new index_1.PackageXMLGenerater();
            });
            it("can generate empty package.xml", function () {
                var xml = generater.toXML();
                assert.equal(xml, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Package xmlns=\"http://soap.sforce.com/2006/04/metadata\">\n    <types/>\n    <version>36.0</version>\n</Package>\n");
            });
        });
        describe("with options", function () {
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
    describe("getOrCreateTypeObject", function () {
        var generater;
        beforeEach(function () {
            generater = new index_1.PackageXMLGenerater();
        });
        it("can create type if empty", function () {
            var key1 = generater.getOrCreateTypeObject("Key1");
            assert.deepEqual(key1, { "members": [], "name": "Key1" });
        });
        it("can create another type", function () {
            var key1 = generater.getOrCreateTypeObject("Key1");
            var key2 = generater.getOrCreateTypeObject("Key2");
            assert.deepEqual(key1, { "members": [], "name": "Key1" });
            assert.deepEqual(key2, { "members": [], "name": "Key2" });
        });
        it("can get type if exist", function () {
            generater.getOrCreateTypeObject("Key1");
            var key1 = generater.getOrCreateTypeObject("Key1");
            assert.deepEqual(key1, { "members": [], "name": "Key1" });
        });
    });
    describe("addFile", function () {
        var generater;
        beforeEach(function () {
            generater = new index_1.PackageXMLGenerater();
        });
        it("can add class file", function () {
            generater.addFile({ dir: "classes", name: "TestClassFileName" });
            var apexClassType = generater.getOrCreateTypeObject("ApexClass");
            assert.equal(apexClassType.name, "ApexClass");
            assert.equal(apexClassType.members[0], "TestClassFileName");
        });
        it("can add staticresource file", function () {
            generater.addFile({ dir: "staticresources", name: "Static" });
            var staticresourceType = generater.getOrCreateTypeObject("StaticResource");
            assert.equal(staticresourceType.name, "StaticResource");
            assert.equal(staticresourceType.members[0], "Static");
        });
    });
    describe("sortByTypes", function () {
        var generater;
        describe("default", function () {
            beforeEach(function () {
                generater = new index_1.PackageXMLGenerater();
            });
            it("is sorted by default typeOrder", function () {
                generater.getOrCreateTypeObject("CustomMetadata");
                generater.getOrCreateTypeObject("ApexComponent");
                generater.getOrCreateTypeObject("StaticResource");
                generater.getOrCreateTypeObject("Layout");
                generater.getOrCreateTypeObject("ApexClass");
                generater.getOrCreateTypeObject("CustomObject");
                generater.getOrCreateTypeObject("ApexPage");
                generater.sortByTypes();
                generater.sfdcPackage.Package.types.forEach(function (val, index) {
                    assert.equal(val.name, generater.options.typeOrder[index]);
                });
            });
        });
        describe("custom order", function () {
            var typeOrder = [
                "StaticResource",
                "Layout",
                "CustomObject",
                "CustomMetadata",
                "ApexPage",
                "ApexComponent",
                "ApexClass"
            ];
            beforeEach(function () {
                generater = new index_1.PackageXMLGenerater({ typeOrder: typeOrder });
            });
            it("is sorted by custom typeOrder", function () {
                generater.getOrCreateTypeObject("CustomMetadata");
                generater.getOrCreateTypeObject("ApexComponent");
                generater.getOrCreateTypeObject("StaticResource");
                generater.getOrCreateTypeObject("Layout");
                generater.getOrCreateTypeObject("ApexClass");
                generater.getOrCreateTypeObject("CustomObject");
                generater.getOrCreateTypeObject("ApexPage");
                generater.sortByTypes();
                generater.sfdcPackage.Package.types.forEach(function (val, index) {
                    assert.equal(val.name, typeOrder[index]);
                });
            });
        });
    });
});
//# sourceMappingURL=index.spec.js.map