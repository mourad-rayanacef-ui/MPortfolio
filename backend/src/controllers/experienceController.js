const { Experience } = require('../models');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

exports.getAllExperiences = async (req, res) => {
  try { 
    const experiences = await Experience.findAll({ 
      where: { isActive: true },
      order: [['order', 'ASC'], ['startDate', 'DESC']] 
    }); 
    res.json(experiences); 
  }
  catch (error) { 
    console.error('Get all experiences error:', error);
    res.status(500).json({ message: error.message }); 
  }
};

exports.getExperience = async (req, res) => {
  try {
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    console.error('Get experience error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createExperience = async (req, res) => {
  try {
    console.log('=== CREATE EXPERIENCE ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const { 
      title, company, location, type, startDate, endDate, 
      isCurrent, description, achievements, technologies, 
      website, order, isActive, companyLogo, companyLogoPublicId
    } = req.body;
    
    // ✅ No Cloudinary upload here - frontend already uploaded
    
    let achievementsArray = achievements;
    let technologiesArray = technologies;
    
    if (typeof achievements === 'string') {
      try {
        achievementsArray = JSON.parse(achievements);
      } catch (e) {
        achievementsArray = achievements.split(',').map(a => a.trim()).filter(Boolean);
      }
    }
    
    if (typeof technologies === 'string') {
      try {
        technologiesArray = JSON.parse(technologies);
      } catch (e) {
        technologiesArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    
    const experienceData = {
      title,
      company,
      companyLogo: companyLogo || null,
      companyLogoPublicId: companyLogoPublicId || null,
      location: location || '',
      type: type || 'Full-Time',
      startDate: startDate || null,
      endDate: isCurrent === 'true' || isCurrent === true ? null : (endDate || null),
      isCurrent: isCurrent === 'true' || isCurrent === true,
      description: description || '',
      achievements: achievementsArray || [],
      technologies: technologiesArray || [],
      website: website || '',
      order: parseInt(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    };
    
    console.log('Creating experience with data:', experienceData);
    
    const experience = await Experience.create(experienceData);
    res.status(201).json(experience);
  }
  catch (error) { 
    console.error('Create experience error:', error);
    res.status(400).json({ message: error.message }); 
  }
};

exports.updateExperience = async (req, res) => {
  try {
    console.log('=== UPDATE EXPERIENCE ===');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const experience = await Experience.findByPk(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    const { 
      title, company, location, type, startDate, endDate, 
      isCurrent, description, achievements, technologies, 
      website, order, isActive, companyLogo, companyLogoPublicId
    } = req.body;
    
    let achievementsArray = achievements;
    let technologiesArray = technologies;
    
    if (typeof achievements === 'string') {
      try {
        achievementsArray = JSON.parse(achievements);
      } catch (e) {
        achievementsArray = achievements.split(',').map(a => a.trim()).filter(Boolean);
      }
    }
    
    if (typeof technologies === 'string') {
      try {
        technologiesArray = JSON.parse(technologies);
      } catch (e) {
        technologiesArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    
    const updateData = {
      title: title || experience.title,
      company: company || experience.company,
      companyLogo: companyLogo !== undefined ? companyLogo : experience.companyLogo,
      companyLogoPublicId: companyLogoPublicId !== undefined ? companyLogoPublicId : experience.companyLogoPublicId,
      location: location !== undefined ? location : experience.location,
      type: type || experience.type,
      startDate: startDate || experience.startDate,
      endDate: isCurrent === 'true' || isCurrent === true ? null : (endDate || experience.endDate),
      isCurrent: isCurrent === 'true' || isCurrent === true,
      description: description !== undefined ? description : experience.description,
      achievements: achievementsArray || experience.achievements,
      technologies: technologiesArray || experience.technologies,
      website: website !== undefined ? website : experience.website,
      order: order !== undefined ? parseInt(order) : experience.order,
      isActive: isActive !== undefined ? isActive : experience.isActive
    };
    
    // Delete old logo if new one is provided
    if (companyLogoPublicId && experience.companyLogoPublicId && experience.companyLogoPublicId !== companyLogoPublicId) {
      await deleteFromCloudinary(experience.companyLogoPublicId);
    }
    
    console.log('Updating experience with data:', updateData);
    
    await experience.update(updateData);
    res.json(experience);
  }
  catch (error) { 
    console.error('Update experience error:', error);
    res.status(400).json({ message: error.message }); 
  }
};

exports.deleteExperience = async (req, res) => {
  try { 
    const experience = await Experience.findByPk(req.params.id); 
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    if (experience.companyLogoPublicId) {
      await deleteFromCloudinary(experience.companyLogoPublicId);
    }
    
    await experience.destroy(); 
    res.json({ message: 'Experience deleted successfully' }); 
  }
  catch (error) { 
    console.error('Delete experience error:', error);
    res.status(500).json({ message: error.message }); 
  }
};