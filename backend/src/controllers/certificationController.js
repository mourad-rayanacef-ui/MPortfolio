const { Certification } = require('../models');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

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
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    
    // Extract fields from req.body
    const { name, issuer, date, status, certificateUrl, certificatePublicId, logoUrl, logoPublicId } = req.body;
    
    console.log('Extracted values:', { name, issuer, date, status, certificateUrl, logoUrl });
    
    // Validate required fields
    if (!name || name.trim() === '') {
      console.error('❌ Name is required but not provided');
      return res.status(400).json({ 
        success: false,
        message: 'Certification name is required'
      });
    }
    
    const certificationData = {
      name: name.trim(),
      issuer: (issuer && issuer.trim()) ? issuer.trim() : '',
      date: (date && date.trim()) ? date.trim() : '',
      status: status || 'Completed',
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
    res.status(400).json({ 
      success: false,
      message: error.message
    }); 
  }
};

exports.updateCertification = async (req, res) => {
  try {
    console.log('=== UPDATE CERTIFICATION ===');
    console.log('ID:', req.params.id);
    console.log('req.body:', req.body);
    
    const certification = await Certification.findByPk(req.params.id);
    if (!certification) {
      return res.status(404).json({ 
        success: false,
        message: 'Certification not found' 
      });
    }
    
    const { name, issuer, date, status, certificateUrl, certificatePublicId, logoUrl, logoPublicId } = req.body;
    
    const updateData = {};
    if (name !== undefined && name !== null) updateData.name = name.trim();
    if (issuer !== undefined) updateData.issuer = issuer;
    if (date !== undefined) updateData.date = date;
    if (status !== undefined) updateData.status = status;
    if (certificateUrl !== undefined) updateData.certificateUrl = certificateUrl;
    if (certificatePublicId !== undefined) updateData.certificatePublicId = certificatePublicId;
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
    if (logoPublicId !== undefined) updateData.logoPublicId = logoPublicId;
    
    // Delete old files if new ones are provided
    if (certificatePublicId && certification.certificatePublicId && certification.certificatePublicId !== certificatePublicId) {
      await deleteFromCloudinary(certification.certificatePublicId);
    }
    if (logoPublicId && certification.logoPublicId && certification.logoPublicId !== logoPublicId) {
      await deleteFromCloudinary(certification.logoPublicId);
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