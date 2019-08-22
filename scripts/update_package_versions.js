const fs = require('fs');
const path = require('path');

let packagePath = path.resolve(process.cwd(), './package.json');
let text = fs.readFileSync(packagePath, "utf-8");

const package = JSON.parse(text);
let deps = package["dependencies"];
let devDeps = package["devDependencies"];

// Update versions of @vcl modules
function update(obj) {
    Object.keys(obj).forEach((val) => {
        if (val.includes("@vcl/build-demo")) {
            obj[val] = "^0.4.0-12";
        } else if (val.includes("@vcl")) {
            obj[val] = "^0.4.0-0";
        }
    });
}

update(deps);
update(devDeps);

// Move @vcl module from deps to devDeps if it is not normalize or theme
Object.keys(deps).forEach((val) => {
    if (!val.includes("normalize.css") && !val.includes("@vcl/theme")) {
        devDeps[val] = deps[val];
        delete deps[val];
    }
});

// Add another dep
devDeps["npm-run-all"] = "^4.1.5";

// Update scripts
package["scripts"] = {
    "test": "vcl-preprocessor ./index.sss ./build/test.css",
    "browsersync": "browser-sync start --server --files \"demo\" \"build\" --index \"/build/index.html\" ",
    "build-demo": "vcl-build-demo",
    "start": "npm-run-all --parallel build-demo browsersync"
};

function sortByKey(obj) {
    let tmp = {};
    Object.keys(obj).sort().forEach((key) => {
        tmp[key] = obj[key];
    });
    return tmp;
}

package["dependencies"] = sortByKey(package["dependencies"]);
package["devDependencies"] = sortByKey(package["devDependencies"]);

fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));