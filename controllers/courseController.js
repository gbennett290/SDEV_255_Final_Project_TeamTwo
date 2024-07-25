const User = require('../models/User');
const Course = require('../models/course');

module.exports.courses_get = (req, res) => {
    Course.find().sort({ code: 'asc'})
    .then((result)=> {
        res.render('courses', {title: 'Course Index', courses: result})
    })
    .catch((err) => {
        console.log(err);
    });
}

module.exports.create_course = (req, res) => {
    // Only allow teachers to create courses
    if (req.isTeacher === true) {
        const course = new Course(req.body);
        course.save()
            .then((result) => {
                res.redirect('/courses');
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.redirect('/');
    };    
}

module.exports.update_course = (req, res) => {
    // Only allow teachers to update courses
    if (req.isTeacher === true) {
        const courseID = req.body._id;
        delete req.body['_id'];
        Course.updateOne({_id: courseID}, req.body)
            .then((result) => {
                res.redirect('/courses');
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.redirect('/');
    };   
}

module.exports.add_course = (req, res) => {
    const classID = req.params.id;
    const userID = req.userID;    
    
    // Sentinel to prevent manual access
    if (req.isTeacher === true) {
        res.redirect('/');
    }

    //Check if class exists in course list and push to its id to user schedule array. Redirect to course list.
    Course.findById(classID)
        .then((result) => {
            const code = result.code;
            User.updateOne( { _id: userID}, {$addToSet: { schedule: classID }})                
                .then((result) => {
                    if(result.modifiedCount === 0){
                        throw new Error ( code +' already exists in your schedule!');
                    } else {
                        console.log("ADD COURSE ID:" + classID + " TO: " + userID);
                        res.json({ redirect: '/courses'});
                    }
                })
                .catch((err) => {
                    res.status(400).json({ errors: err.message });
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });    
}

module.exports.drop_course = (req, res) => {
    const classID = req.params.id;
    const userID = req.userID;    
    
    // Sentinel to prevent manual access
    if (req.isTeacher === true) {
        res.redirect('/');
    }

    // Check if class exists and pull from user schedule. Redirect to schedule.
    Course.findById(classID)
        .then((result) => {
            User.updateOne( { _id: userID}, { $pull: { schedule: classID }})                
                .then((result) => {
                    console.log("DROP COURSE ID:" + classID + " FROM: " + userID);
                    res.json({ redirect: '/schedule'})
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });    
}

module.exports.course_details = (req, res) => {
    const id = req.params.id;

    Course.findById(id)
        .then((result) => {
            res.render('details', { course: result, title: 'Course Details'})
        })
        .catch((err) => {
            console.log(err);
        });    
}

module.exports.delete_course = (req, res) => {
    const id = req.params.id;

    // Only allow teachers to delete courses
    if (req.isTeacher === true) {
        Course.findByIdAndDelete(id)
            .then(result => {
                // Remove reference to deleted course from all student schedules.
                User.updateMany({}, { $pull: { schedule : id } })
                .then(result => {
                    res.json({ redirect: '/courses'})
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        res.redirect('/');
    };    
}