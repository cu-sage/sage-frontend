// Generate Mock Data using Generator

// Context of the quest in which recommending games
// ex: Struggling in ctConcept, recopmmend in focus of current quest (games)
var gameModel = 
[
    {
        gameId: 2,
        difficulty: 1, // [1,2,3]; 1 = Easy, etc
        gameFocus: null,// cirricula (context), cirricula analysis
        ctConcepts: [1,2,3,4,5,6,] // 1 = Loops, etc., directly from hairball analysis
        // ctConcepts/gameFocus: complication
    },
    // ...
]

var studentsModel = 
[
    {
        userId: 1,
        gameId: 1,
        difficulty: 2,
        duration: 500, // 500 seconds
        ctScoresMastery: mean([3,3,2,1,2,0,]),

        // generated in scratch analyzer
        pectScore: null, // Q: where stored?
        pointScores: null, // Q: where stored? different meanings in parsons, etc.

        objectPoints: null, // points earned when each statement completed, rubric points

    }
]

/*  
Algorithm:
    Parameters:
        - duration: 1 to 3
            1 can be under 5 minutes, 2 can be 6 - 15 minutes, 3 can be 20 minutes
        - difficulty: 1 to 3
            1 is easy, 3 is hard
        - ctScores
            1 (novice) to 3 (proficiency)
    Output:
        Array of Games and Recommendation Scores

    Multi-Criteria:
        Games
            Find similarity scores between CT Concepts of each game
            Find similairty scores between difficulty og games
                3-3: 100%, 3-2: 50%, 3-1: 0%
            
    User-Based: K-Means Culturing
        scores, games' scores, durations
*/
