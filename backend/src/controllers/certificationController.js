const { Certification } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

exports.getAllCertifications = async (req, res) => {
  try { 
    const certifications = await Certification.findAll({ order: [['date', 'DESC']] }); 
    res.json(certifications); 
  }
  catch (error) { 
    console.error('Get all certifications error:', error);
    res.status(500).json({ message: error.message }); 
  }
};

exports.createCertification = async (req, res) => {
  try {
    console.log('=== CREATE CERTIFICATION ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    
    // Get the raw form data from multer
    const { name, issuer, date } = req.body;
    
    console.log('Name from body:', name);
    console.log('Issuer from body:', issuer);
    console.log('Date from body:', date);
    
    // Handle file uploads
    let certificateUrl, certificatePublicId;
    let logoUrl, logoPublicId;
    
    // Handle certificate file (PDF/Image)
    if (req.files && req.files.certificate) {
      console.log('Uploading certificate file...');
      const result = await uploadToCloudinary(req.files.certificate[0].buffer, 'certifications');
      certificateUrl = result.secure_url;
      certificatePublicId = result.public_id;
      console.log('Certificate uploaded to Cloudinary:', certificateUrl);
    }
    
    // Handle logo file (Image)
    if (req.files && req.files.logo) {
      console.log('Uploading logo file...');
      const result = await uploadToCloudinary(req.files.logo[0].buffer, 'certification-logos');
      logoUrl = result.secure_url;
      logoPublicId = result.public_id;
      console.log('Logo uploaded to Cloudinary:', logoUrl);
    }
    
    // Validate required fields
    if (!name || name.trim() === '') {
      console.error('❌ Name is required but not provided');
      return res.status(400).json({ 
        success: false,
        message: 'Certification name is required',
        received: req.body 
      });
    }
    
    // Create certification
    const certificationData = {
      name: name.trim(),
      issuer: (issuer && issuer.trim()) ? issuer.trim() : '',
      date: (date && date.trim()) ? date.trim() : '',
      certificateUrl: certificateUrl || null,
      certificatePublicId: certificatePublicId || null,
      logoUrl: logoUrl || null,
      logoPublicId: logoPublicId || null
    };
    
    console.log('📝 Creating certification with data:', certificationData);
    
    const certification = await Certification.create(certificationData);
    
    console.log('✅ Certification created successfully:', certification.toJSON());
    
    res.status(201).json({
      success: true,
      data: certification
    });
    
  } catch (error) { 
    console.error('❌ Create certification error:', error);
    console.error('Error details:', error.errors || error);
    
    res.status(400).json({ 
      success: false,
      message: error.message,
      errors: error.errors ? error.errors.map(e => e.message) : undefined,
      receivedBody: req.body 
    }); 
  }
};

exports.updateCertification = async (req, res) => {
  try {
    console.log('=== UPDATE CERTIFICATION ===');
    console.log('ID:', req.params.id);
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    
    const certification = await Certification.findByPk(req.params.id);
    if (!certification) {
      return res.status(404).json({ 
        success: false,
        message: 'Certification not found' 
      });
    }
    
    // Extract fields
    const { name, issuer, date } = req.body;
    
    // Prepare update data
    const updateData = {};
    if (name !== undefined && name !== null) {
      updateData.name = name.trim();
    }
    if (issuer !== undefined && issuer !== null) {
      updateData.issuer = issuer.trim();
    }
    if (date !== undefined && date !== null) {
      updateData.date = date.trim();
    }
    
    // Handle certificate file upload
    if (req.files && req.files.certificate) {
      if (certification.certificatePublicId) {
        await deleteFromCloudinary(certification.certificatePublicId);
      }
      const result = await uploadToCloudinary(req.files.certificate[0].buffer, 'certifications');
      updateData.certificateUrl = result.secure_url;
      updateData.certificatePublicId = result.public_id;
      console.log('Certificate uploaded to Cloudinary:', result.secure_url);
    }
    
    // Handle logo file upload
    if (req.files && req.files.logo) {
      if (certification.logoPublicId) {
        await deleteFromCloudinary(certification.logoPublicId);
      }
      const result = await uploadToCloudinary(req.files.logo[0].buffer, 'certification-logos');
      updateData.logoUrl = result.secure_url;
      updateData.logoPublicId = result.public_id;
      console.log('Logo uploaded to Cloudinary:', result.secure_url);
    }
    
    console.log('Updating certification with:', updateData);
    
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

exports.deleteCertification = async (req, res) => {
  try {
    console.log('=== DELETE CERTIFICATION ===');
    console.log('ID:', req.params.id);
    
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