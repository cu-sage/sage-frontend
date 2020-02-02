var tutorCommentModel = mongoose.model('tutorStudentComment', new mongoose.Schema({
    studentID: String,
    assignmentID: String,
    objectiveID: String,
    timestamp: String
}));

module.exports = tutorCommentModel;