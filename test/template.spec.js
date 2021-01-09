"use strict";

const { ServiceBroker } = require("moleculer");
const { Template } = require("../index");

const timestamp = Date.now();

const globalStore ={};

// mock imicros-minio mixin
const Store = (/*options*/) => { return {
    methods: {
        async putObject ({ ctx = null, objectName = null, value = null } = {}) {
            if ( !ctx || !objectName ) return false;
            
            let internal = Buffer.from(ctx.meta.acl.ownerId + "~" + objectName).toString("base64");
            
            this.store[internal] = value;
            return true;
        },
        async getObject ({ ctx = null, objectName }) {
            if ( !ctx || !objectName ) throw new Error("missing parameter");

            let internal = Buffer.from(ctx.meta.acl.ownerId + "~" + objectName).toString("base64");
            
            return this.store[internal];            
        }   
    },
    created () {
        this.store = globalStore;
    }
};};

describe("Test template service", () => {

    let broker, service;
    beforeAll(() => {
    });
    
    afterAll(() => {
    });
    
    describe("Test create service", () => {

        it("it should start the broker", async () => {
            broker = new ServiceBroker({
                logger: console,
                logLevel: "debug" // "info" //"debug"
            });
            service = await broker.createService(Template, Object.assign({ 
                name: "template",
                mixins: [Store()]
            }));
            await broker.start();
            expect(service).toBeDefined();
        });

    });
    
    describe("Test render", () => {

        let opts;
        
        beforeEach(() => {
            opts = { 
                meta: { 
                    acl: {
                        accessToken: "this is the access token",
                        ownerId: `g1-${timestamp}`,
                        unrestricted: true
                    }, 
                    user: { 
                        id: `1-${timestamp}` , 
                        email: `1-${timestamp}@host.com` }
                } 
            };
        });
        
        it("it should render the template", async () => {
            let params = {
                name: "path/to/template/hello.tpl",
                data: { name: "my friend" }
            };
            let internal = Buffer.from(opts.meta.acl.ownerId + "~" + params.name).toString("base64");
            globalStore[internal] = { template: "Hello, {{ name }}!" };

            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual("Hello, my friend!");
            });
                
        });
        
        it("it should render template with deep data structure", async () => {
            let params = {
                name: "path/to/template/hello.tpl",
                data: { name: { lastName: "my friend" } }
            };
            let internal = Buffer.from(opts.meta.acl.ownerId + "~" + params.name).toString("base64");
            globalStore[internal] = { template: "Hello, {{ name.lastName }}!" };

            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual("Hello, my friend!");
            });
                
        });
        
        it("it should return null due to missing object", async () => {
            let params = {
                name: "path/to/template/missing.tpl",
                data: { name: "my friend" }
            };
            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual(null);
            });
                
        });
        
        it("it should return null due to unvalid template", async () => {
            let params = {
                name: "path/to/template/unvalid.tpl",
                data: { name: "my friend" }
            };
            let internal = Buffer.from(opts.meta.acl.ownerId + "~" + params.name).toString("base64");
            globalStore[internal] = { template: "Hello, {{ name.lastName !" };  // missing closing brackets...
          
            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual(null);
            });
                
        });
        
        it("it should render an given template", async () => {
            let params = {
                template: "Hello, {{ name }}!",
                data: { name: "my best friend" }
            };
            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual("Hello, my best friend!");
            });
                
        });
        
        it("it should return null due to missing template", async () => {
            let params = {
                data: { name: "my friend" }
            };
            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual(null);
            });
                
        });
        
    });
        
    describe("Test stop broker", () => {
        it("should stop the broker", async () => {
            expect.assertions(1);
            await broker.stop();
            expect(broker).toBeDefined();
        });
    });    
    
});