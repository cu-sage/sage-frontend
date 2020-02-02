var env = process.env.NODE_ENV || "development"

var config = {
    local:{
        tokenSecret: process.env.tokenSecret || 'okiamnotafraidthatyoucanseethissinceitisonlyatest'
    },
    test:{
        tokenSecret: process.env.tokenSecret || 'okiamnotafraidthatyoucanseethissinceitisonlyatest'
    },
    /**
     * TODO : Change token for development server
     */
    development:{
        tokenSecret: process.env.tokenSecret || 'okiamnotafraidthatyoucanseethissinceitisonlyatest'
    },
    uat : {
        tokenSecret: process.env.tokenSecret || 'okiamnotafraidthatyoucanseethissinceitisonlyatest'
    },
     /**
     * TODO : Change token for production server
     */
    production:{
        tokenSecret: process.env.tokenSecret || 'okiamnotafraidthatyoucanseethissinceitisonlyatest'
    }
}

module.exports = config[env];
