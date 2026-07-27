const { Course } = require('../models');

exports.getAllCourses = async (req, res) => {
  try { const courses = await Course.findAll({ order: [['name', 'ASC']] }); res.json(courses); }
  catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createCourse = async (req, res) => {
  try { const course = await Course.create(req.body); res.status(201).json(course); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

exports.updateCourse = async (req, res) => {
  try { const course = await Course.findByPk(req.params.id); if (!course) return res.status(404).json({ message: 'Course not found' }); await course.update(req.body); res.json(course); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

exports.deleteCourse = async (req, res) => {
  try { const course = await Course.findByPk(req.params.id); if (!course) return res.status(404).json({ message: 'Course not found' }); await course.destroy(); res.json({ message: 'Course deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
};