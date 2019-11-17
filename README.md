# imicros-templates
[![Build Status](https://travis-ci.org/al66/imicros-templates.svg?branch=master)](https://travis-ci.org/al66/imicros-templates)
[![Coverage Status](https://coveralls.io/repos/github/al66/imicros-templates/badge.svg?branch=master)](https://coveralls.io/github/al66/imicros-templates?branch=master)

[Moleculer](https://github.com/moleculerjs/moleculer) service for template rendering

Uses [Dust](http://www.dustjs.com/) as render engine.

## Installation
```
$ npm install imicros-templates --save
```
## Dependencies
Required mixins (or a similar mixin with the same notation):
- [imicros-acl](https://github.com/al66/imicros-acl)
- [imciros-store](https://github.com/al66/imicros-store)

# Usage
## Usage template service
```js
const { ServiceBroker } = require("moleculer");
const { AclMixin } = require("imicros-acl");
const { Mixin } = require("imicros-store");
const { Template } = require("imicros-template");

broker = new ServiceBroker({
    logger: console
});
broker.createService(Template, Object.assign({ 
    mixins: [Mixin, AclMixin]
}));
broker.start();
```
## Actions template service
- compile { template, name } => { name }  
- render { name, data } => result  
- remove { name } => boolean

## Usage template mixin
```js
const { TemplateMixin } = require("imicros-template");
...
...
broker.createService(MyService, Object.assign({ 
    mixins: [TemplateMixin({ service: "template" })],  // .. name of running template service 
    dependencies: ["template"]                         // .. name of running template service  
}));

```
## Actions template mixin
```js
    let params = {
        name: "hello",                      // .. name of a stored compiled template
        data: { name: "my friend" }
    };
    this.render({ctx: ctx, name: params.name, data: params.data });

```

