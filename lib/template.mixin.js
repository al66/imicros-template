/**
 * @license MIT, imicros.de (c) 2019 Andreas Leinen
 */
"use strict";

const _ = require("lodash");

module.exports = (options) => { return {
    
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
    actions: {},

    /**
     * Events
     */
    events: {},

    /**
     * Methods
     */
    methods: {

        async render ({ ctx = null, name = null, data = {} } = {}) {
            if ( !ctx || !name ) return "";
            
            let opts = { meta: ctx.meta };
            let params = null;
            
            // call template service
            params = {
                name: name,
                data: data
            };
            try {
                let result = await this.broker.call(this.template.service + ".render", params, opts);
                this.logger.debug(`Template ${name} rendered`, { name: name });
                return result;            
            } catch (err) {
                /* istanbul ignore next */
                {
                    this.logger.error(`Failed to render template ${name}`, { name: name });
                    throw err;
                }
            }
        }
        
    },

    /**
     * Service created lifecycle event handler
     */
    created() {
        this.template = {
            service: _.get(options, "service", "templates" )
        };    
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {},

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {}
    
};};