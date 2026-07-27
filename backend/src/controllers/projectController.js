const { Project } = require('../models');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

exports.getAllProjects = async (req, res) => {
  try { 
    const projects = await Project.findAll({ 
      order: [['order', 'ASC']] 
    }); 
    res.json(projects); 
  } catch (error) { 
    console.error('Get all projects error:', error);
    res.status(500).json({ message: error.message }); 
  }
};

exports.createProject = async (req, res) => {
  try {
    console.log('=== CREATE PROJECT ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    // ✅ No Cloudinary upload here - frontend already uploaded
    const { name, techStack, image, imagePublicId, description, details, startDate, endDate, challenges, learnings, order } = req.body;
    
    let techStackArray = techStack;
    if (typeof techStack === 'string') {
      try {
        techStackArray = JSON.parse(techStack);
      } catch (e) {
        techStackArray = techStack.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    
    const project = await Project.create({
      name: name,
      techStack: techStackArray || [],
      image: image || null,
      imagePublicId: imagePublicId || null,
      description: description || null,
      details: details || null,
      startDate: startDate || null,
      endDate: endDate || null,
      challenges: challenges || null,
      learnings: learnings || null,
      order: order || 0
    });
    
    res.status(201).json(project);
  } catch (error) { 
    console.error('Create project error:', error);
    res.status(400).json({ message: error.message }); 
  }
};

exports.updateProject = async (req, res) => {
  try {
    console.log('=== UPDATE PROJECT ===');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const { name, techStack, image, imagePublicId, description, details, startDate, endDate, challenges, learnings, order } = req.body;
    
    let techStackArray = techStack;
    if (typeof techStack === 'string') {
      try {
        techStackArray = JSON.parse(techStack);
      } catch (e) {
        techStackArray = techStack.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    
    // Delete old image if new one is provided
    if (imagePublicId && project.imagePublicId && project.imagePublicId !== imagePublicId) {
      await deleteFromCloudinary(project.imagePublicId);
    }
    
    await project.update({
      name: name !== undefined ? name : project.name,
      techStack: techStackArray !== undefined ? techStackArray : project.techStack,
      image: image !== undefined ? image : project.image,
      imagePublicId: imagePublicId !== undefined ? imagePublicId : project.imagePublicId,
      description: description !== undefined ? description : project.description,
      details: details !== undefined ? details : project.details,
      startDate: startDate !== undefined ? startDate : project.startDate,
      endDate: endDate !== undefined ? endDate : project.endDate,
      challenges: challenges !== undefined ? challenges : project.challenges,
      learnings: learnings !== undefined ? learnings : project.learnings,
      order: order !== undefined ? order : project.order
    });
    
    res.json(project);
  } catch (error) { 
    console.error('Update project error:', error);
    res.status(400).json({ message: error.message }); 
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.imagePublicId) await deleteFromCloudinary(project.imagePublicId);
    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) { 
    console.error('Delete project error:', error);
    res.status(500).json({ message: error.message }); 
  }
};