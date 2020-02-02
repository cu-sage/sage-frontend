var env = process.env.NODE_ENV || "development"

var config = {

    local : {
        STAGE : "test",
        NODE_SERVER : "http://localhost:8081/",
        RECOMMENDATION_SERVER : "https://s94lk76f3b.execute-api.us-east-1.amazonaws.com/Dev/gameRecommendations"
    },

	test : {
		STAGE : "test",
		NODE_SERVER : "http://localhost:8081/",
		RECOMMENDATION_SERVER : "https://s94lk76f3b.execute-api.us-east-1.amazonaws.com/Dev/gameRecommendations"
	},
	uat :{ 
		/**
		 * TODO : Change this to development server url
		 */
		STAGE : "uat",
		NODE_SERVER : "http://uat_server",
		RECOMMENDATION_SERVER : "https://s94lk76f3b.execute-api.us-east-1.amazonaws.com/Dev/gameRecommendations"
	},
	development : {
		/*
		* TODO : Change this to development server url
		*/
		STAGE : "development",
		NODE_SERVER : "http://dev.cu-sage.org:8081/",
		RECOMMENDATION_SERVER : "https://s94lk76f3b.execute-api.us-east-1.amazonaws.com/Dev/gameRecommendations"
	},
	production : {
		/*
		* TODO : Change this to production server url
		*/
		STAGE : "production",
		NODE_SERVER : "http://production_server",
		RECOMMENDATION_SERVER : "https://s94lk76f3b.execute-api.us-east-1.amazonaws.com/Dev/gameRecommendations"
	}
}

module.exports = config[env];