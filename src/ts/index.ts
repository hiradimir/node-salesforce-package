const html = require("html");
const path = require("path");
const xmlbuilder = require("xmlbuilder");
const nodeExtend = require("node.extend");


const defaultOptions = {
  sfdcPackage: {
    "Package": {
      "@xmlns": "http://soap.sforce.com/2006/04/metadata",
      "types": [],
      "version": "36.0"
    }
  },
  typeKeys: {
    "classes": "ApexClass",
    "components": "ApexComponent",
    "pages": "ApexPage",
    "customMetadata": "CustomMetadata",
    "objects": "CustomObject",
    "layouts": "Layout",
    "staticresources": "StaticResource"
  },
  typeOrder: [
    "ApexClass",
    "ApexComponent",
    "ApexPage",
    "CustomMetadata",
    "CustomObject",
    "Layout",
    "StaticResource"
  ]
};


export class PackageXMLGenerater {

  sfdcPackage = {
    "Package": {
      "@xmlns": "http://soap.sforce.com/2006/04/metadata",
      "types": [],
      "version": "36.0"
    }
  };

  options: {typeKeys: any, typeOrder: string[]} = <any>{};

  constructor(options: {sfdcPackage?: {Package: {version?: string}}, typeKeys?: {[index: string]: string}, typeOrder?: string[]}) {
    this.options = nodeExtend(true, this.sfdcPackage, options.sfdcPackage);
  }

  getOrCreateTypeObject(key) {
    for (let sfdcType in this.sfdcPackage.Package.types) {
      if (key === this.sfdcPackage.Package.types[sfdcType].name) {
        return this.sfdcPackage.Package.types[sfdcType];
      }
    }
    let newSfdcType = {"members": [], "name": key};
    this.sfdcPackage.Package.types.push(newSfdcType);
    return newSfdcType;
  }

  addFile(filepath: {dir: string, name: string}) {
    let packageKey = this.options.typeKeys[filepath.dir];
    this.getOrCreateTypeObject(packageKey).members.push(filepath.name);
  }

  sortByTypes() {

    this.sfdcPackage.Package.types.sort(
      function compare(type1, type2) {
        return this.options.typeOrder.indexOf(type1.name) - this.options.typeOrder.indexOf(type2.name);
      }
    );
  }

  toXML(files: Array<{dir: string, name: string}> = []) {
    files.forEach(this.addFile);
    this.sortByTypes();
    let xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
      html.prettyPrint(xmlbuilder.create(this.sfdcPackage).toString(), {indent_size: 4}) + "\n";
    return xmlString;
  }

}
