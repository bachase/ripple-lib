'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash')
const assert = require('assert')
var Ajv = require('ajv');
var pack = require('ajv-pack');
var glob = require('glob');
var mkdirp = require('mkdirp');

const ValidationError = require('../src/common/errors').ValidationError

const ROOT = path.dirname(path.normalize(__dirname));

const customFormats = [
    {name : "address", newName : "isValidAddress", requires : "const {isValidAddress} = require('ripple-address-codec');\n" },
    {name : "secret", newName : "isValidSecret", requires : "const {isValidSecret} = require('"+ path.join(ROOT,"src/common/utils") + "');\n"}]

// Work-around to inject custom format support in the generated code
function hackFixFormats(moduleCode) {
    _.forEach(customFormats, format => {
        if(moduleCode.includes("formats." + format.name))
        {
            moduleCode = moduleCode.replace("formats." + format.name, format.newName)
            moduleCode = moduleCode.replace("formats')();\n","formats')();\n" + format.requires)
        }
    } );
    return moduleCode
}

function main() {
    
    const globPatt = path.join(ROOT,"src/common/schemas/**/*.json")
    const schemas = _.map(glob.sync(globPatt), p => ({path : p, schema: require(p)}))
    const titles = _.map(schemas, s => s.schema.title)
    const duplicates = _.keys(_.pick(_.countBy(titles), count => count > 1))
    assert(duplicates.length === 0, 'Duplicate schemas for: ' + duplicates)

    var ajv = new Ajv({sourceCode: true, extendRefs:true});
    // Load all the schemas into ajv before compiling to avoid having to resolve ref 
    // dependencies
    _.forEach(schemas, s => ajv.addSchema(s.schema, s.schema.title))
    
    // Add dummy support for customFormats to ensure ajv won't error
    // These will be replaced with teh actualy format checkers in hackFixForamts
    _.forEach(customFormats, format => ajv.addFormat(format.name, function(){ return true; }))


    // Then generate each into its own module
    const generated = _.map(schemas, s => {
        var moduleCode = hackFixFormats(pack(ajv, ajv.compile(s.schema)));
        // handle additional formats
        const newPath = s.path.replace("src/common/schemas", "gen/validators").replace(".json",".js");
        mkdirp.sync(path.dirname(path.normalize(newPath)))
        fs.writeFileSync(newPath, moduleCode);
        return newPath
    })
    

    // Lastly generate the overall schema-validator function
    process.exit(0)
}

main();