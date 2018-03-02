var gameModel = 
[
    {
        gameId: 2
        difficulty: [1,2,3], // 1 = Easy, etc
        ctConcepts: [1,2,3,4,5,6,] // 1 = Loops, etc.
    },
    // ...
]

var studentsModel = 
[
    {
        userId: 1,
        gameId: 1,
        duration: 500, // 500 seconds
        ctScores: [3,3,2,1,2,0,] // scores per concept, order relation to ct concepts above
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

    Multi-Criteria:
        Games
            Find similarity scores between CT Concepts of each game
            Find similairty scores between difficulty og games
                3-3: 100%, 3-2: 50%, 3-1: 0%
            
    Uaer-Based: K-Means Culturing
        scores, games' scores, durations
        


*/
