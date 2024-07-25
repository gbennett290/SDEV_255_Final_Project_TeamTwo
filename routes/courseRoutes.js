const { Router } = require('express');
const courseController = require('../controllers/courseController');
const { requireAuth, checkUser, checkTeacher } = require('../middleware/authMiddleware');

const router = Router();

router.get('/courses', requireAuth, checkTeacher, courseController.courses_get);
router.post('/courses', requireAuth, checkTeacher, courseController.create_course);
router.post('/courses/add/:id', requireAuth, checkTeacher, courseController.add_course);
router.post('/courses/drop/:id', requireAuth, checkTeacher, courseController.drop_course);
router.get('/courses/:id', requireAuth, courseController.course_details);
router.delete('/courses/:id', requireAuth, checkTeacher, courseController.delete_course);

module.exports = router;