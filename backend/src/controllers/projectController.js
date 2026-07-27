const { Project } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

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
    
    let imageUrl, imagePublicId;
    
    if (req.file) { 
      const result = await uploadToCloudinary(req.file.buffer, 'projects'); 
      imageUrl = result.secure_url; 
      imagePublicId = result.public_id; 
    }
    
    let techStack = req.body.techStack;
    if (typeof techStack === 'string') {
      try {
        techStack = JSON.parse(techStack);
      } catch (e) {
        techStack = techStack.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    
    const project = await Project.create({
      name: req.body.name,
      techStack: techStack || [],
      image: imageUrl || null,
      imagePublicId: imagePublicId || null,
      description: req.body.description || null,
      details: req.body.details || null,
      startDate: req.body.startDate || null,
      endDate: req.body.endDate || null,
      challenges: req.body.challenges || null,
      learnings: req.body.learnings || null,
      order: req.body.order || 0
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
    
    let imageUrl = project.image;
    let imagePublicId = project.imagePublicId;
    
    if (req.file) {
      if (project.imagePublicId) await deleteFromCloudinary(project.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer, 'projects');
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }
    
    let techStack = req.body.techStack;
    if (typeof techStack === 'string') {
      try {
        techStack = JSON.parse(techStack);
      } catch (e) {
        techStack = techStack.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    
    await project.update({
      name: req.body.name !== undefined ? req.body.name : project.name,
      techStack: techStack !== undefined ? techStack : project.techStack,
      image: imageUrl,
      imagePublicId: imagePublicId,
      description: req.body.description !== undefined ? req.body.description : project.description,
      details: req.body.details !== undefined ? req.body.details : project.details,
      startDate: req.body.startDate !== undefined ? req.body.startDate : project.startDate,
      endDate: req.body.endDate !== undefined ? req.body.endDate : project.endDate,
      challenges: req.body.challenges !== undefined ? req.body.challenges : project.challenges,
      learnings: req.body.learnings !== undefined ? req.body.learnings : project.learnings,
      order: req.body.order !== undefined ? req.body.order : project.order
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