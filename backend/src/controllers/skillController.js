const { Skill } = require('../models');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

exports.getAllSkills = async (req, res) => {
  try { 
    const skills = await Skill.findAll({ 
      where: { isActive: true }, 
      order: [['order', 'ASC']] 
    }); 
    res.json(skills); 
  }
  catch (error) { 
    console.error('Get all skills error:', error);
    res.status(500).json({ message: error.message }); 
  }
};

exports.createSkill = async (req, res) => {
  try {
    console.log('=== CREATE SKILL ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const { name, category, level, icon, iconType, iconUrl, iconPublicId, description, since, projects, order, isActive } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Skill name is required' });
    }
    if (!category || category.trim() === '') {
      return res.status(400).json({ message: 'Category is required' });
    }
    
    // ✅ No Cloudinary upload here - frontend already uploaded
    
    let projectsArray = projects;
    if (typeof projects === 'string') {
      try {
        projectsArray = JSON.parse(projects);
      } catch (e) {
        projectsArray = projects.split(',').map(p => p.trim()).filter(Boolean);
      }
    }
    
    const skillData = {
      name: name.trim(),
      category: category.trim(),
      level: level || 50,
      icon: icon || '⚛️',
      iconType: iconType || 'emoji',
      iconUrl: iconUrl || null,
      iconPublicId: iconPublicId || null,
      description: description || '',
      since: since || '',
      projects: projectsArray || [],
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    };
    
    console.log('Creating skill with data:', skillData);
    
    const skill = await Skill.create(skillData);
    res.status(201).json(skill);
  }
  catch (error) { 
    console.error('Create skill error:', error);
    res.status(400).json({ message: error.message }); 
  }
};

exports.updateSkill = async (req, res) => {
  try {
    console.log('=== UPDATE SKILL ===');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    
    const { name, category, level, icon, iconType, iconUrl, iconPublicId, description, since, projects, order, isActive } = req.body;
    
    let projectsArray = projects;
    if (typeof projects === 'string') {
      try {
        projectsArray = JSON.parse(projects);
      } catch (e) {
        projectsArray = projects.split(',').map(p => p.trim()).filter(Boolean);
      }
    }
    
    // Delete old icon if new one is provided
    if (iconPublicId && skill.iconPublicId && skill.iconPublicId !== iconPublicId) {
      await deleteFromCloudinary(skill.iconPublicId);
    }
    
    const updateData = {
      name: name !== undefined ? name.trim() : skill.name,
      category: category !== undefined ? category.trim() : skill.category,
      level: level !== undefined ? level : skill.level,
      icon: icon || skill.icon,
      iconType: iconType || skill.iconType,
      iconUrl: iconUrl !== undefined ? iconUrl : skill.iconUrl,
      iconPublicId: iconPublicId !== undefined ? iconPublicId : skill.iconPublicId,
      description: description !== undefined ? description : skill.description,
      since: since !== undefined ? since : skill.since,
      projects: projectsArray || skill.projects,
      order: order !== undefined ? order : skill.order,
      isActive: isActive !== undefined ? isActive : skill.isActive
    };
    
    console.log('Updating skill with data:', updateData);
    
    await skill.update(updateData);
    res.json(skill);
  }
  catch (error) { 
    console.error('Update skill error:', error);
    res.status(400).json({ message: error.message }); 
  }
};

exports.deleteSkill = async (req, res) => {
  try { 
    const skill = await Skill.findByPk(req.params.id); 
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    
    if (skill.iconPublicId) {
      await deleteFromCloudinary(skill.iconPublicId);
    }
    
    await skill.destroy(); 
    res.json({ message: 'Skill deleted successfully' }); 
  }
  catch (error) { 
    console.error('Delete skill error:', error);
    res.status(500).json({ message: error.message }); 
  }
};