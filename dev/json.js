const dust = require("dustjs-helpers");

let template = "{ {#features}'{name}':{name}{@sep},{/sep}{@last}!{/last}{/features} }";
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

