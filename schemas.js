/**
 * Created by SecretLabs on 14.09.15.
 */

module.exports = {

    faculty: {name: String},

    course: {facultyId: String, name: String},

    group: {name: String, facultyId: String, courseId: String}

};