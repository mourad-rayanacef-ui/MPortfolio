const { PersonalInfo } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// Helper: pull the useful bits out of a Cloudinary error object.
// error.error is where Cloudinary puts its actual message (e.g. "Invalid API key",
// "Invalid Signature", account restrictions, etc). error.message alone is often
// just the generic SDK wrapper text ("Server returned unexpected status code - 403").
const cloudinaryErrorDetails = (error) => ({
  message: error?.message,
  http_code: error?.http_code,
  name: error?.name,
  reason: error?.error?.message || error?.error || null,
});

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

// PUT update personal info
exports.updatePersonalInfo = async (req, res) => {
  try {
    console.log('=== UPDATE PERSONAL INFO ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    let info = await PersonalInfo.findOne();

    // Prepare data payload from request body
    const updateData = { ...req.body };

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.profileImage;
    delete updateData.profileImagePublicId;
    delete updateData.cvUrl;
    delete updateData.cvPublicId;

    console.log('Update data:', updateData);

    // Handle files if uploaded
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
          console.log('✅ CV uploaded:', cvResult.secure_url);
        } catch (cvErr) {
          const details = cloudinaryErrorDetails(cvErr);
          console.error('❌ CV upload failed:', details);
          return res.status(400).json({
            message: 'CV upload failed: ' + cvErr.message,
            cloudinaryDetails: details
          });
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
          console.log('✅ Profile Image uploaded:', imgResult.secure_url);
        } catch (imgErr) {
          const details = cloudinaryErrorDetails(imgErr);
          console.error('❌ Profile image upload failed:', details);
          return res.status(400).json({
            message: 'Profile image upload failed: ' + imgErr.message,
            cloudinaryDetails: details
          });
        }
      }
    }

    // Update or create
    if (!info) {
      info = await PersonalInfo.create(updateData);
      console.log('Created new PersonalInfo record');
    } else {
      // ✅ Only update fields that are provided
      await info.update(updateData);
      console.log('Updated PersonalInfo record');
    }

    // Fetch the updated record
    const updatedInfo = await PersonalInfo.findByPk(info.id);
    res.json(updatedInfo);
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

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'File must be an image' });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size must be less than 5MB' });
    }

    let info = await PersonalInfo.findOne();
    if (!info) {
      info = await PersonalInfo.create({});
    }

    if (info.profileImagePublicId) {
      await deleteFromCloudinary(info.profileImagePublicId, 'image');
    }

    const result = await uploadToCloudinary(req.file.buffer, 'images', {
      resource_type: 'image'
    });

    await info.update({
      profileImage: result.secure_url,
      profileImagePublicId: result.public_id
    });

    res.json({
      message: 'Profile image uploaded successfully',
      url: result.secure_url,
      profileImage: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    const details = cloudinaryErrorDetails(error);
    console.error('❌ Upload profile image error:', details);
    res.status(400).json({
      message: error.message,
      // TODO: remove cloudinaryDetails from the response once you've diagnosed
      // the 403 — it's here temporarily so the frontend console shows the
      // real Cloudinary reason instead of the generic SDK wrapper message.
      cloudinaryDetails: details
    });
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

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'CV must be a PDF file' });
    }

    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size must be less than 10MB' });
    }

    let info = await PersonalInfo.findOne();
    if (!info) {
      info = await PersonalInfo.create({});
    }

    if (info.cvPublicId) {
      await deleteFromCloudinary(info.cvPublicId, 'raw');
    }

    const result = await uploadToCloudinary(req.file.buffer, 'documents', {
      resource_type: 'raw',
      flags: 'attachment'
    });

    await info.update({
      cvUrl: result.secure_url,
      cvPublicId: result.public_id
    });

    res.json({
      message: 'CV uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    const details = cloudinaryErrorDetails(error);
    console.error('❌ Upload CV error:', details);
    res.status(400).json({
      message: error.message,
      cloudinaryDetails: details
    });
  }
};