"use strict";
var html = require("html");
var path = require("path");
var xmlbuilder = require("xmlbuilder");
var nodeExtend = require("node.extend");
var defaultOptions = {
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
var PackageXMLGenerater = (function () {
    function PackageXMLGenerater(options) {
        if (options === void 0) { options = {}; }
        this.sfdcPackage = {
            "Package": {
                "@xmlns": "http://soap.sforce.com/2006/04/metadata",
                "types": [],
                "version": "36.0"
            }
        };
        this.options = {
            typeKeys: defaultOptions.typeKeys,
            typeOrder: defaultOptions.typeOrder
        };
        this.sfdcPackage = nodeExtend(true, this.sfdcPackage, options.sfdcPackage);
        this.options = nodeExtend(true, this.options, { typeKeys: options.typeKeys, typeOrder: options.typeOrder });
    }
    PackageXMLGenerater.prototype.getOrCreateTypeObject = function (key) {
        for (var sfdcType in this.sfdcPackage.Package.types) {
            if (key === this.sfdcPackage.Package.types[sfdcType].name) {
                return this.sfdcPackage.Package.types[sfdcType];
            }
        }
        var newSfdcType = { "members": [], "name": key };
        this.sfdcPackage.Package.types.push(newSfdcType);
        return newSfdcType;
    };
    PackageXMLGenerater.prototype.addFile = function (filepath) {
        var packageKey = this.options.typeKeys[filepath.dir];
        this.getOrCreateTypeObject(packageKey).members.push(filepath.name);
    };
    PackageXMLGenerater.prototype.sortByTypes = function () {
        var _this = this;
        this.sfdcPackage.Package.types.sort(function (type1, type2) {
            return _this.options.typeOrder.indexOf(type1.name) - _this.options.typeOrder.indexOf(type2.name);
        });
    };
    PackageXMLGenerater.prototype.toXML = function (files) {
        if (files === void 0) { files = []; }
        files.forEach(this.addFile);
        this.sortByTypes();
        var xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            html.prettyPrint(xmlbuilder.create(this.sfdcPackage).toString(), { indent_size: 4 }) + "\n";
        return xmlString;
    };
    return PackageXMLGenerater;
}());
exports.PackageXMLGenerater = PackageXMLGenerater;
//# sourceMappingURL=index.js.map