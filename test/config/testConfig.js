var chai = require("chai"),
    assert =  chai.assert;

describe("Database configuration test",function(){
    describe("#get development environment section",function(){
        let config =  require("../../config/dbConfig")
        it("should return development section from dbConfig because enviroment development not set",function(){
            assert("development" == config.STAGE,"failed to get development section from config returned : "+config.STAGE);
        });
    });
    
    ["uat","test","production"].forEach(function(section){
        describe("#get "+section+" environment section",function(){
            it("should return "+section+" section from dbConfig also checking is DB property exists",function(){
                process.env.NODE_ENV = section;
                delete require.cache[require.resolve("../../config/dbConfig")];
                let config =  require("../../config/dbConfig")
                assert(section == config.STAGE,"failed to get "+section+" section from config returned : "+config.STAGE);
                assert(config.DB.trim() !== undefined && config.DB.trim() !== "","db configuration is empty, failing");
                assert.isNotOk(config.STAGE == "development");
            });
        });
    });
    delete process.env.NODE_ENV;
})

describe("External URL configuration test",function(){
    describe("#get development environment section from external url config",function(){
        let config =  require("../../config/externalURLS")
        it("should return development section from externalURLS because enviroment development not set",function(){
            assert("development" == config.STAGE,"failed to get development section from config returned : "+config.STAGE);
        });
    });
    
    ["uat","test","production"].forEach(function(section){
        describe("#get "+section+" enviroment section",function(){
            it("should return "+section+" section from externalURLS also checking if properties exists",function(){
                process.env.NODE_ENV = section;
                delete require.cache[require.resolve("../../config/externalURLS")];
                let config =  require("../../config/externalURLS")
                assert(section == config.STAGE,"failed to get "+section+" section from config returned : "+config.STAGE);
                assert(config.NODE_SERVER.trim() !== undefined && config.NODE_SERVER.trim() !== "","configuration is empty, failing");
                assert(config.RECOMMENDATION_SERVER.trim() !== undefined && config.RECOMMENDATION_SERVER.trim() !== "","configuration is empty, failing");
                assert.isNotOk(config.STAGE == "development");
            });
        });
    });
    delete process.env.NODE_ENV;
});