const { PersonalInfo } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// GET personal info
exports.getPersonalInfo = async (req, res) => {
  try {
    let info = await PersonalInfo.findOne();
    if (!info) {
      info = {};
    }
    res.json(info);
  } catch (error) {
    console.error('Get personal info error:', error);
    res.status(500).json({ message: error.message });
  }
};

// PUT update personal info (Handles CV/Resume and Profile Image uploads)
exports.updatePersonalInfo = async (req, res) => {
  try {
    console.log('=== UPDATE PERSONAL INFO ===');
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    
    let info = await PersonalInfo.findOne();
    console.log('Existing info:', info ? 'Found' : 'Not found');

    // Prepare data payload from request body
    const updateData = { ...req.body };

    // Never let raw form-data accidentally overwrite these managed fields
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Handle files if uploaded via multer
    if (req.files) {
      // Handle CV upload
      if (req.files.cv && req.files.cv[0]) {
        try {
          console.log('Processing CV upload...');
          if (info && info.cvPublicId) {
            await deleteFromCloudinary(info.cvPublicId, 'raw');
          }
          const cvResult = await uploadToCloudinary(req.files.cv[0].buffer, 'documents', {
            resource_type: 'raw',
            flags: 'attachment'
          });
          updateData.cvUrl = cvResult.secure_url;
          updateData.cvPublicId = cvResult.public_id;
          console.log('CV uploaded successfully:', cvResult.secure_url);
        } catch (cvErr) {
          console.error('CV upload failed:', cvErr);
          return res.status(400).json({ message: 'CV upload failed: ' + cvErr.message });
        }
      }

      // Handle Profile Image upload
      if (req.files.profileImage && req.files.profileImage[0]) {
        try {
          console.log('Processing Profile Image upload...');
          if (info && info.profileImagePublicId) {
            await deleteFromCloudinary(info.profileImagePublicId, 'image');
          }
          const imgResult = await uploadToCloudinary(req.files.profileImage[0].buffer, 'images', {
            resource_type: 'image'
          });
          updateData.profileImage = imgResult.secure_url;
          updateData.profileImagePublicId = imgResult.public_id;
          console.log('Profile Image uploaded successfully:', imgResult.secure_url);
        } catch (imgErr) {
          console.error('Profile image upload failed:', imgErr);
          return res.status(400).json({ message: 'Profile image upload failed: ' + imgErr.message });
        }
      }
    } else if (req.file) {
      // Fallback if using single file upload for CV
      try {
        console.log('Processing single file upload (CV)...');
        if (info && info.cvPublicId) {
          await deleteFromCloudinary(info.cvPublicId, 'raw');
        }
        const result = await uploadToCloudinary(req.file.buffer, 'documents', {
          resource_type: 'raw',
          flags: 'attachment'
        });
        updateData.cvUrl = result.secure_url;
        updateData.cvPublicId = result.public_id;
        console.log('CV uploaded successfully:', result.secure_url);
      } catch (cvErr) {
        console.error('CV upload failed:', cvErr);
        return res.status(400).json({ message: 'CV upload failed: ' + cvErr.message });
      }
    }

    // Update or create
    if (!info) {
      info = await PersonalInfo.create(updateData);
      console.log('Created new PersonalInfo record');
    } else {
      await info.update(updateData);
      console.log('Updated PersonalInfo record');
    }

    res.json(info);
  } catch (error) {
    console.error('Update personal info error:', error);
    res.status(400).json({ message: error.message });
  }
};

// UPLOAD profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    console.log('=== UPLOAD PROFILE IMAGE ===');
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let info = await PersonalInfo.findOne();
    if (!info) {
      info = await PersonalInfo.create({});
    }

    // Delete old image if exists
    if (info.profileImagePublicId) {
      await deleteFromCloudinary(info.profileImagePublicId, 'image');
    }

    // Upload new image
    const result = await uploadToCloudinary(req.file.buffer, 'images', {
      resource_type: 'image'
    });

    // Update the profile image fields
    await info.update({
      profileImage: result.secure_url,
      profileImagePublicId: result.public_id
    });

    console.log('Profile image uploaded successfully:', result.secure_url);

    res.json({
      message: 'Profile image uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(400).json({ message: error.message });
  }
};

// UPLOAD CV
exports.uploadCV = async (req, res) => {
  try {
    console.log('=== UPLOAD CV ===');
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if file is PDF
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'CV must be a PDF file' });
    }

    let info = await PersonalInfo.findOne();
    if (!info) {
      info = await PersonalInfo.create({});
    }

    // Delete old CV if exists
    if (info.cvPublicId) {
      await deleteFromCloudinary(info.cvPublicId, 'raw');
    }

    // Upload new CV
    const result = await uploadToCloudinary(req.file.buffer, 'documents', {
      resource_type: 'raw',
      flags: 'attachment'
    });

    // Update the CV fields
    await info.update({
      cvUrl: result.secure_url,
      cvPublicId: result.public_id
    });

    console.log('CV uploaded successfully:', result.secure_url);

    res.json({
      message: 'CV uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    res.status(400).json({ message: error.message });
  }
};