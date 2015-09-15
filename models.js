/**
 * Created by SecretLabs on 14.09.15.
 */

module.exports = function Models(mongoose) {

    var Schema = mongoose.Schema;

    var userSchema = new Schema({name: String, password: String});
    this.User = mongoose.model('users', userSchema);

    var facultySchema = new Schema({name: String});
    var courseSchema = new Schema({facultyId: String, name: String});
    var groupSchema = new Schema({name: String, facultyId: String, courseId: String});

    this.Faculty = mongoose.model('faculties', facultySchema);
    this.Course = mongoose.model('courses', courseSchema);
    this.Group = mongoose.model('groups', groupSchema);

    this.connection = mongoose.connection;

};
