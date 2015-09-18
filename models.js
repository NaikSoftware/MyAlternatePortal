/**
 * Created by SecretLabs on 14.09.15.
 */

module.exports = function Models(mongoose) {

    var Schema = mongoose.Schema;

    var userSchema = new Schema({name: String, password: String});
    this.User = mongoose.model('users', userSchema);

    var facultySchema = new Schema({name: String});

    var courseSchema = new Schema({
        name: String,
        facultyId: Schema.Types.ObjectId
    });

    var groupSchema = new Schema({
        name: String,
        facultyId: Schema.Types.ObjectId,
        courseId: Schema.Types.ObjectId
    });

    this.Faculty = mongoose.model('faculties', facultySchema);
    this.Course = mongoose.model('courses', courseSchema);
    this.Group = mongoose.model('groups', groupSchema);

    // Schedule on 1 week
    var scheduleSchema = new Schema({
        groupId: Schema.Types.ObjectId,
        startTime: Date,
        days: [{
            name: String,
            date: Date,
            lectures: [{
                number: Number,
                text: String
            }]
        }]
    });
    this.Schedule = mongoose.model('schedules', scheduleSchema);

    this.db = mongoose;
};
