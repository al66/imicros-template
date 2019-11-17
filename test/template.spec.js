"use strict";

const { ServiceBroker } = require("moleculer");
const { Template } = require("../index");
const { AclMixin } = require("imicros-acl");

const timestamp = Date.now();

// mock imicros-store mixin
const Store = (options) => { return {
    methods: {
        async set ({ ctx = null, key = null, value = null } = {}) {
            if ( !ctx || !key ) return false;
            
            let internal = Buffer.from(ctx.meta.acl.ownerIdr + "~" + key).toString("base64");
            
            this.store[internal] = value;
            return true;
        },
        async get ({ ctx = null, key }) {
            if ( !ctx || !key ) throw new Error("missing parameter");

            let internal = Buffer.from(ctx.meta.acl.ownerIdr + "~" + key).toString("base64");
            
            return this.store[internal];            
        },   
        async del ({ ctx = null, key }) {
            if ( !ctx || !key ) throw new Error("missing parameter");
            
            let internal = Buffer.from(ctx.meta.acl.ownerIdr + "~" + key).toString("base64");
            
            delete this.store[internal];
            
            return true;            
        }   
    },
    created () {
        this.store = options.store;
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
                logLevel: "info" //"debug"
            });
            service = await broker.createService(Template, Object.assign({ 
                name: "template",
                mixins: [Store({ store: {} }), AclMixin]
            }));
            await broker.start();
            expect(service).toBeDefined();
        });

    });
    
    describe("Test compile and render", () => {

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
                        email: `1-${timestamp}@host.com` }, 
                    access: [`1-${timestamp}`, `2-${timestamp}`] 
                } 
            };
        });
        
        it("it should compile and store a template", async () => {
            let params = {
                template: "Hello, {name}!",
                name: "hello"
            };
            return broker.call("template.compile", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res.name).toBeDefined();
            });
                
        });
        
        it("it should render the template", async () => {
            let params = {
                name: "hello",
                data: { name: "my friend" }
            };
            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual("Hello, my friend!");
            });
                
        });
        
        it("it should compile and store a second template", async () => {
            opts.meta.acl.ownerId = `g2-${timestamp}`;
            let params = {
                template: "Hello, {name} from second group!",
                name: "hello"
            };
            return broker.call("template.compile", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res.name).toBeDefined();
            });
                
        });

        it("it should render the second template", async () => {
            opts.meta.acl.ownerId = `g2-${timestamp}`;
            let params = {
                name: "hello",
                data: { name: "my friend" }
            };
            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual("Hello, my friend from second group!");
            });
                
        });
                
        it("it should remove the second template", async () => {
            opts.meta.acl.ownerId = `g2-${timestamp}`;
            let params = {
                name: "hello"
            };
            return broker.call("template.remove", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual(true);
            });
                
        });
        

        it("it should render the first template again", async () => {
            let params = {
                name: "hello",
                data: { name: "my friend" }
            };
            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual("Hello, my friend!");
            });
                
        });

        it("it should update a template", async () => {
            let params = {
                template: "Hello, {name}! (updated)",
                name: "hello"
            };
            return broker.call("template.compile", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res.name).toBeDefined();
            });
                
        });
        
        it("it should render the updated template", async () => {
            let params = {
                name: "hello",
                data: { name: "my friend" }
            };
            return broker.call("template.render", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual("Hello, my friend! (updated)");
            });
                
        });

        it("it should remove the first template", async () => {
            let params = {
                name: "hello"
            };
            return broker.call("template.remove", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res).toEqual(true);
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