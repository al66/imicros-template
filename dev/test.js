//const dust = require("dustjs-linkedin");
const dust = require("dustjs-helpers");
const uuid = require("uuid/v4");

const templates = [];

for (let i=0; i < 100; i++) {
    let template = "Welcome to {name} by "+i+".";
    let owner = uuid();
    let name = owner + "~" + "hello";
    templates.push(name);
    let compiled = dust.compile(template, name);
    if (i === 0) console.log(compiled);
    dust.loadSource(compiled);
}

for (let n=0; n< templates.length; n++) {
    dust.render(templates[n], { name: "imicros" }, function(err, out) {
        // `out` contains the rendered output.
        console.log(out);
    });
}

let onLoad =  (name, done) => {
    done(null, "Welcome to {name} by "+name+".");
};
dust.onLoad = onLoad;

dust.render("any template", { name: "imicros" }, function(err, out) {
    // `out` contains the rendered output.
    console.log(out);
});

//let template = "Dust does {#features}{name}{@sep}, {/sep}{/features}!";
let template = "Dust does {#features}{name}{@sep}, {/sep}{@last}!{/last}{/features}";
let data = {
    features: [
    {name: "async"},
    {name: "helpers"},
    {name: "filters"},
    {name: "a little bit of logic"},
    {name: "and more"}
    ]
};
let result;
dust.loadSource(dust.compile(template, "example"));
dust.render("example", data, function(err, out) {
    // `out` contains the rendered output.
    result = out;
    
});
console.log(result);

template = "Wrapped partial {> example /} in another template...";
dust.loadSource(dust.compile(template, "partial"));
dust.render("partial", data, function(err, out) {
    // `out` contains the rendered output.
    console.log(out);
});

