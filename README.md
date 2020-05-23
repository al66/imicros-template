# imicros-templates
[![Build Status](https://travis-ci.org/al66/imicros-templates.svg?branch=master)](https://travis-ci.org/al66/imicros-templates)
[![Coverage Status](https://coveralls.io/repos/github/al66/imicros-templates/badge.svg?branch=master)](https://coveralls.io/github/al66/imicros-templates?branch=master)

[Moleculer](https://github.com/moleculerjs/moleculer) service for template rendering

Uses [Handlebars](https://handlebarsjs.com/) as render engine.

## Installation
```
$ npm install imicros-templates --save
```
## Dependencies
Required mixins (or a similar mixin with the same notation):
- [imciros-minio](https://github.com/al66/imicros-minio)

# Usage
## Usage template service
```js
const { ServiceBroker } = require("moleculer");
const { MinioMixin } = require("imicros-minio");
const { Template } = require("imicros-template");

broker = new ServiceBroker({
    logger: console
});
broker.createService(Template, Object.assign({ 
    mixins: [MinioMixin()]
}));
broker.start();
```
## Actions template service
- render { name, data } => result  


