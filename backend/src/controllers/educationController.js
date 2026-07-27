const { Education, Certification, Course } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// GET all educations with their certifications and courses
exports.getEducation = async (req, res) => {
  try {
    const educations = await Education.findAll({
      order: [['startYear', 'DESC']]
    });
    
    if (!educations || educations.length === 0) {
      return res.json([]);
    }
    
    const educationsWithRelations = await Promise.all(
      educations.map(async (edu) => {
        const certifications = await Certification.findAll({
          where: { educationId: edu.id }
        });
        
        const courses = await Course.findAll({
          where: { educationId: edu.id }
        });
        
        return {
          ...edu.toJSON(),
          Certifications: certifications,
          Courses: courses
        };
      })
    );
    
    res.json(educationsWithRelations);
  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST create new education entry
exports.createEducation = async (req, res) => {
  try {
    console.log('Creating education with data:', req.body);
    console.log('File:', req.file);
    
    // Strip out temporary ID if sent by frontend form data
    const bodyData = { ...req.body };
    if (bodyData.id && String(bodyData.id).startsWith('temp-')) {
      delete bodyData.id;
    }

    // Ensure required fields
    if (!bodyData.degree || !bodyData.university) {
      return res.status(400).json({ message: 'Degree and University are required' });
    }

    const education = await Education.create(bodyData);
    
    let updatedEducation = education;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'education');
      await education.update({
        certificateUrl: result.secure_url,
        certificatePublicId: result.public_id
      });
      updatedEducation = await Education.findByPk(education.id);
    }
    
    res.status(201).json(updatedEducation);
  } catch (error) {
    console.error('Create education error:', error);
    res.status(400).json({ message: error.message });
  }
};

// PUT update specific education by ID - AUTO-CREATES IF NOT EXISTS
exports.updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Updating education with ID:', id);
    
    // If it's a temp ID, just create new
    if (String(id).startsWith('temp-')) {
      return exports.createEducation(req, res);
    }

    let education = await Education.findByPk(id);
    
    // If education doesn't exist, CREATE IT instead of returning 404
    if (!education) {
      console.log(`Education with ID ${id} not found. Creating new record instead.`);
      const bodyData = { ...req.body };
      delete bodyData.id;
      req.body = bodyData;
      return exports.createEducation(req, res);
    }
    
    // Update existing education
    await education.update(req.body);
    
    if (req.file) {
      if (education.certificatePublicId) {
        await deleteFromCloudinary(education.certificatePublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'education');
      await education.update({
        certificateUrl: result.secure_url,
        certificatePublicId: result.public_id
      });
    }
    
    const certifications = await Certification.findAll({
      where: { educationId: education.id }
    });
    
    const courses = await Course.findAll({
      where: { educationId: education.id }
    });
    
    const educationWithRelations = {
      ...education.toJSON(),
      Certifications: certifications,
      Courses: courses
    };
    
    res.json(educationWithRelations);
  } catch (error) {
    console.error('Update education error:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE education entry
exports.deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (String(id).startsWith('temp-')) {
      return res.json({ message: 'Temporary education entry removed successfully' });
    }

    const education = await Education.findByPk(id);
    
    if (!education) {
      return res.status(404).json({ message: 'Education not found' });
    }

    if (education.certificatePublicId) {
      await deleteFromCloudinary(education.certificatePublicId);
    }
    
    await education.destroy();
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST add certification to specific education - WITH LOGO SUPPORT
exports.addCertification = async (req, res) => {
  try {
    console.log('=== ADD CERTIFICATION ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    // Extract fields from request body (multer parses FormData into req.body)
    const { name, issuer, date, educationId } = req.body;
    
    console.log('Extracted values:', { name, issuer, date, educationId });
    
    // Validate required fields
    if (!name || name.trim() === '') {
      console.error('❌ Name is required but not provided');
      return res.status(400).json({ 
        success: false,
        message: 'Certification name is required' 
      });
    }
    
    // Handle file uploads
    let certificateUrl, certificatePublicId;
    let logoUrl, logoPublicId;
    
    // Handle certificate file
    if (req.files && req.files.certificate) {
      console.log('📤 Uploading certificate file...');
      const result = await uploadToCloudinary(req.files.certificate[0].buffer, 'certifications');
      certificateUrl = result.secure_url;
      certificatePublicId = result.public_id;
      console.log('✅ Certificate uploaded:', certificateUrl);
    }
    
    // Handle logo file
    if (req.files && req.files.logo) {
      console.log('📤 Uploading logo file...');
      const result = await uploadToCloudinary(req.files.logo[0].buffer, 'certification-logos');
      logoUrl = result.secure_url;
      logoPublicId = result.public_id;
      console.log('✅ Logo uploaded:', logoUrl);
    }
    
    // Create certification with logo fields
    const certificationData = {
      name: name.trim(),
      issuer: issuer || '',
      date: date || '',
      educationId: educationId || null,
      certificateUrl: certificateUrl || null,
      certificatePublicId: certificatePublicId || null,
      logoUrl: logoUrl || null,
      logoPublicId: logoPublicId || null
    };
    
    console.log('📝 Creating certification with data:', certificationData);
    
    // Create the certification
    const certification = await Certification.create(certificationData);
    
    console.log('✅ Certification created successfully:', certification.toJSON());
    res.status(201).json({
      success: true,
      data: certification
    });
    
  } catch (error) {
    console.error('❌ Add certification error:', error);
    console.error('Error details:', error.errors || error);
    res.status(400).json({ 
      success: false,
      message: error.message,
      errors: error.errors ? error.errors.map(e => e.message) : undefined
    });
  }
};

// PUT update certification - WITH LOGO SUPPORT
exports.updateCertification = async (req, res) => {
  try {
    console.log('=== UPDATE CERTIFICATION ===');
    console.log('ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const certification = await Certification.findByPk(req.params.id);
    if (!certification) {
      return res.status(404).json({ 
        success: false,
        message: 'Certification not found' 
      });
    }
    
    // Extract fields from request body
    const { name, issuer, date, educationId } = req.body;
    
    // Prepare update data
    const updateData = {};
    if (name !== undefined && name !== null) updateData.name = name.trim();
    if (issuer !== undefined) updateData.issuer = issuer;
    if (date !== undefined) updateData.date = date;
    if (educationId !== undefined) updateData.educationId = educationId;
    
    // Handle certificate file upload
    if (req.files && req.files.certificate) {
      if (certification.certificatePublicId) {
        await deleteFromCloudinary(certification.certificatePublicId);
      }
      const result = await uploadToCloudinary(req.files.certificate[0].buffer, 'certifications');
      updateData.certificateUrl = result.secure_url;
      updateData.certificatePublicId = result.public_id;
      console.log('✅ Certificate uploaded:', result.secure_url);
    }
    
    // Handle logo file upload
    if (req.files && req.files.logo) {
      if (certification.logoPublicId) {
        await deleteFromCloudinary(certification.logoPublicId);
      }
      const result = await uploadToCloudinary(req.files.logo[0].buffer, 'certification-logos');
      updateData.logoUrl = result.secure_url;
      updateData.logoPublicId = result.public_id;
      console.log('✅ Logo uploaded:', result.secure_url);
    }
    
    await certification.update(updateData);
    console.log('✅ Certification updated successfully:', certification.toJSON());
    res.json({
      success: true,
      data: certification
    });
    
  } catch (error) {
    console.error('❌ Update certification error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// DELETE certification - WITH LOGO SUPPORT
exports.deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findByPk(req.params.id);
    if (!certification) {
      return res.status(404).json({ 
        success: false,
        message: 'Certification not found' 
      });
    }
    
    if (certification.certificatePublicId) {
      await deleteFromCloudinary(certification.certificatePublicId);
    }
    
    if (certification.logoPublicId) {
      await deleteFromCloudinary(certification.logoPublicId);
    }
    
    await certification.destroy();
    console.log('✅ Certification deleted successfully');
    res.json({ 
      success: true,
      message: 'Certification deleted successfully' 
    });
    
  } catch (error) {
    console.error('❌ Delete certification error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// POST add course
exports.addCourse = async (req, res) => {
  try {
    const { educationId } = req.body;
    let skills = req.body.skills;
    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
      } catch (e) {
        skills = skills.split(',').map(s => s.trim());
      }
    }
    
    const course = await Course.create({
      name: req.body.name,
      grade: req.body.grade,
      skills: skills || [],
      educationId: educationId || null
    });
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Add course error:', error);
    res.status(400).json({ message: error.message });
  }
};

// PUT update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await course.update(req.body);
    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(400).json({ message: error.message });
  }
};

// DELETE course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await course.destroy();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: error.message });
  }
};