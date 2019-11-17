/**
 * @license MIT, imicros.de (c) 2019 Andreas Leinen
 */
"use strict";

const dust = require("dustjs-helpers");
const _ = require("lodash");

/** Actions */
// action compile { template, name } => { name }
// action render { name, data } => result
// action remove { name } => boolean

module.exports = {
    name: "dust",
    
    /**
     * Service settings
     */
    settings: {},

    /**
     * Service metadata
     */
    metadata: {},

    /**
     * Service dependencies
     */
    //dependencies: [],	

    /**
     * Actions
     */
    actions: {

        /**
         * compile template
         * 
         * @actions
         * @param {String} template
         * @param {String} name
         * 
         * @returns {Object} result
         */
        compile: {
            params: {
                template: { type: "string" },
                name: { type: "string" }
            },			
            async handler(ctx) {
                let owner = _.get(ctx.meta,"acl.ownerId",null);
                if (!owner) throw new Error("access not authorized");

                if (!await this.isAuthorized({ ctx: ctx, ressource: { template: ctx.params.name }, action: "compile" })) throw new Error("not authorized");
                
                let name = ctx.params.name;
                let internalName = owner + "~" + name;
                let compiled = await dust.compile(ctx.params.template, internalName);
                await this.set({ctx: ctx, key: name, value: compiled});
                return { name: name };
            }
        },

        /**
         * render template
         * 
         * @actions
         * @param {String} name
         * @param {Object} data
         * 
         * @returns {String} result 
         */
        render: {
            params: {
                name: { type: "string" },
                data: { type: "object" },
            },
            async handler(ctx) {
                let owner = _.get(ctx.meta,"acl.ownerId",null);
                if (!owner) throw new Error("access not authorized");

                if (!await this.isAuthorized({ ctx: ctx, ressource: { template: ctx.params.name }, action: "render" })) throw new Error("not authorized");
                
                let name = ctx.params.name;
                let internalName = owner + "~" + name;
                let result;
                
                let compiled = await this.get({ctx: ctx, key: name});
                dust.loadSource(compiled);
                dust.render(internalName, ctx.params.data, function(err, out) {
                    result = out;   // `out` contains the rendered output.
                });
                return result;
            }
        },

        /**
         * remove template
         * 
         * @actions
         * @param {String} name
         * 
         * @returns {Boolean} result 
         */
        remove: {
            params: {
                name: { type: "string" }
            },
            async handler(ctx) {
                let owner = _.get(ctx.meta,"acl.ownerId",null);
                if (!owner) throw new Error("access not authorized");

                if (!await this.isAuthorized({ ctx: ctx, ressource: { template: ctx.params.name }, action: "remove" })) throw new Error("not authorized");
                
                let name = ctx.params.name;
                
                let result = await this.del({ctx: ctx, key: name});
                return result;
            }
        }

    },

    /**
     * Events
     */
    events: {},

    /**
     * Methods
     */
    methods: {

    },

    /**
     * Service created lifecycle event handler
     */
    created() {},

    /**
     * Service started lifecycle event handler
     */
    started() {},

    /**
     * Service stopped lifecycle event handler
     */
    stopped() {}
    
};