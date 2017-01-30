import {PackageXMLGenerater} from "./index";
const assert = require("assert");

describe("PackageXMLGenerater", () => {

  describe("constructor", () => {
    let generater: PackageXMLGenerater;
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
