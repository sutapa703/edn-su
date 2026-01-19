import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Create a course (admin only)
router.post('/courses', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { title, description, instructor } = req.body;

    if (!title || !description || !instructor) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const course = new Course({ title, description, instructor });
    await course.save();

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

// Get all courses
router.get('/courses', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const courses = await Course.find().populate('enrolledStudents', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Update a course (admin only)
router.put('/courses/:courseId', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { title, description, instructor } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { title, description, instructor },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

// Delete a course (admin only)
router.delete('/courses/:courseId', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

// Get all users (admin only)
router.get('/users', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Delete a user (admin only)
router.delete('/users/:userId', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

export default router;
