import {PackageXMLGenerater, PackageType} from "./index";
const assert = require("assert");

describe("PackageXMLGenerater", () => {

  describe("constructor", () => {
    let generater: PackageXMLGenerater;
    describe("with no args", () => {
      beforeEach(() => {
        generater = new PackageXMLGenerater();
      });

      it("can generate empty package.xml", () => {
        let xml = generater.toXML();
        assert.equal(xml, `<?xml version="1.0" encoding=\"UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types/>
    <version>36.0</version>
</Package>
`);
      });
    });

    describe("with options", () => {
      beforeEach(() => {
        generater = new PackageXMLGenerater({sfdcPackage: {Package: {version: "38.0"}}});
      });
      it("can change version by constructor argument sfdcPackage.Package.version", () => {
        assert.equal(generater.sfdcPackage.Package.version, "38.0");
      });
      it("not changes no value on constructor argument sfdcPackage.Package", () => {
        assert.equal(generater.sfdcPackage.Package["@xmlns"], "http://soap.sforce.com/2006/04/metadata");
      });
      it("can generate empty package.xml with select version", () => {
        let xml = generater.toXML();
        assert.equal(xml, `<?xml version="1.0" encoding=\"UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types/>
    <version>38.0</version>
</Package>
`);
      });

    });
  });

  describe("getOrCreateTypeObject", () => {
    let generater: PackageXMLGenerater;
    beforeEach(() => {
      generater = new PackageXMLGenerater();
    });
    it("can create type if empty", () => {
      let key1 = generater.getOrCreateTypeObject("Key1");
      assert.deepEqual(key1, {"members": [], "name": "Key1"});
    });
    it("can create another type", () => {
      let key1 = generater.getOrCreateTypeObject("Key1");
      let key2 = generater.getOrCreateTypeObject("Key2");
      assert.deepEqual(key1, {"members": [], "name": "Key1"});
      assert.deepEqual(key2, {"members": [], "name": "Key2"});
    });
    it("can get type if exist", () => {
      generater.getOrCreateTypeObject("Key1");
      let key1 = generater.getOrCreateTypeObject("Key1");
      assert.deepEqual(key1, {"members": [], "name": "Key1"});
    });
  });

  describe("addFile", () => {
    let generater: PackageXMLGenerater;
    beforeEach(() => {
      generater = new PackageXMLGenerater();
    });
    it("can add class file", () => {
      generater.addFile({dir: "classes", name: "TestClassFileName"});
      let apexClassType = generater.getOrCreateTypeObject("ApexClass");
      assert.equal(apexClassType.name, "ApexClass");
      assert.equal(apexClassType.members[0], "TestClassFileName");
    });
    it("can add staticresource file", () => {
      generater.addFile({dir: "staticresources", name: "Static"});
      let staticresourceType = generater.getOrCreateTypeObject("StaticResource");
      assert.equal(staticresourceType.name, "StaticResource");
      assert.equal(staticresourceType.members[0], "Static");
    });
  });

  describe("sortByTypes", () => {
    let generater: PackageXMLGenerater;
    describe("default", () => {
      beforeEach(() => {
        generater = new PackageXMLGenerater();
      });
      it("is sorted by default typeOrder", () => {
        generater.getOrCreateTypeObject("CustomMetadata");
        generater.getOrCreateTypeObject("ApexComponent");
        generater.getOrCreateTypeObject("StaticResource");
        generater.getOrCreateTypeObject("Layout");
        generater.getOrCreateTypeObject("ApexClass");
        generater.getOrCreateTypeObject("CustomObject");
        generater.getOrCreateTypeObject("ApexPage");

        generater.sortByTypes();

        generater.sfdcPackage.Package.types.forEach((val: PackageType, index) => {

          assert.equal(val.name, generater.options.typeOrder[index]);
        });
      });
    });

    describe("custom order", () => {
      const typeOrder = [
        "StaticResource",
        "Layout",
        "CustomObject",
        "CustomMetadata",
        "ApexPage",
        "ApexComponent",
        "ApexClass"
      ];
      beforeEach(() => {
        generater = new PackageXMLGenerater({typeOrder: typeOrder});
      });
      it("is sorted by custom typeOrder", () => {
        generater.getOrCreateTypeObject("CustomMetadata");
        generater.getOrCreateTypeObject("ApexComponent");
        generater.getOrCreateTypeObject("StaticResource");
        generater.getOrCreateTypeObject("Layout");
        generater.getOrCreateTypeObject("ApexClass");
        generater.getOrCreateTypeObject("CustomObject");
        generater.getOrCreateTypeObject("ApexPage");

        generater.sortByTypes();

        generater.sfdcPackage.Package.types.forEach((val: PackageType, index) => {

          assert.equal(val.name, typeOrder[index]);
        });
      });
    });

  });

});
