/**
 * @license MIT, imicros.de (c) 2019 Andreas Leinen
 */
"use strict";

const Handlebars = require("handlebars");

/** Actions */
// action render { templateName, data } => result

module.exports = {
    name: "template",
    
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
                name: [{ type: "string" },{ type: "array" }],
                data: { type: "object" }
            },
            async handler(ctx) {
                if (!await this.isAuthorized({ ctx: ctx, ressource: { template: ctx.params.name }, action: "render" })) throw new Error("not authorized");
                
				// gateway passes name as array if path is used.. 
                let objectName = Array.isArray(ctx.params.name) ? ctx.params.name.join("/") :ctx.params.name;
				
                let templateString = await this.getString({ctx: ctx, objectName: objectName});
                const template = Handlebars.compile(templateString);
                return await template(ctx.params.data);

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