import express from 'express';
import Course from '../models/Course.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get all courses (student can view)
router.get('/courses', verifyToken, checkRole(['student', 'admin']), async (req, res) => {
  try {
    const courses = await Course.find().populate('enrolledStudents', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Enroll in a course
router.post('/courses/:courseId/enroll', verifyToken, checkRole(['student']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(req.user.userId);
    await course.save();

    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
});

// Get enrolled courses for student
router.get('/my-courses', verifyToken, checkRole(['student']), async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: req.user.userId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
  }
});

// Unenroll from a course
router.post('/courses/:courseId/unenroll', verifyToken, checkRole(['student']), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { $pull: { enrolledStudents: req.user.userId } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Unenrolled successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error unenrolling from course', error: error.message });
  }
});

export default router;
