var env = process.env.NODE_ENV || "development";

var config = {
	/**
	 * alternative code  DB : process.env.MONGO_HOST || 'mongodb://user:user@ds133328.mlab.com:33328/sage-login'
	 * this will try to use env based first, fallback to hardcoded if not set
	 */
    local:{
        STAGE :"local",
        DB : "mongodb://user:user@ds133328.mlab.com:33328/sage-login"
    },
	test:{
		STAGE :"test",
		DB : "mongodb://user:user@ds133328.mlab.com:33328/sage-login"
	},
	uat:{
		STAGE :"uat",
		DB : "mongodb://user:user@ds117719.mlab.com:17719/sage-login"
	},
	development:{
		STAGE :"development",
		DB : "mongodb://user:user@ds133328.mlab.com:33328/sage-login"
	},
	/**
	 * TODO : Change with production credentials
	 */
	production:{
		STAGE :"production",
		DB : "mongodb://sage-production"
	}
}

module.exports =  config[env];