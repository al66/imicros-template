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
                name: { type: "string" },
                data: { type: "object" }
            },
            async handler(ctx) {
                if (!await this.isAuthorized({ ctx: ctx, ressource: { template: ctx.params.name }, action: "render" })) throw new Error("not authorized");
                
                let templateString = await this.getString({ctx: ctx, objectName: ctx.params.name});
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