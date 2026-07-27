const { PersonalInfo } = require('../models');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

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

// PUT update personal info (TEXT FIELDS ONLY — files are uploaded directly
// to Cloudinary from the browser now, see setMedia below)
exports.updatePersonalInfo = async (req, res) => {
  try {
    console.log('=== UPDATE PERSONAL INFO ===');
    console.log('Body:', req.body);

    let info = await PersonalInfo.findOne();

    const updateData = { ...req.body };

    // Never allow these to be set through the plain text-update endpoint —
    // they're only ever written by setMedia, after a real Cloudinary upload.
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.profileImage;
    delete updateData.profileImagePublicId;
    delete updateData.cvUrl;
    delete updateData.cvPublicId;

    console.log('Update data:', updateData);

    if (!info) {
      info = await PersonalInfo.create(updateData);
      console.log('Created new PersonalInfo record');
    } else {
      await info.update(updateData);
      console.log('Updated PersonalInfo record');
    }

    const updatedInfo = await PersonalInfo.findByPk(info.id);
    res.json(updatedInfo);
  } catch (error) {
    console.error('Update personal info error:', error);
    res.status(400).json({ message: error.message });
  }
};

// PUT persist media (profile image / CV) that the browser already uploaded
// directly to Cloudinary via an unsigned upload preset. This endpoint never
// talks to Cloudinary's upload API itself — it only calls destroy() to clean
// up the previous asset, which is non-fatal if it fails (see deleteFromCloudinary).
exports.setMedia = async (req, res) => {
  try {
    console.log('=== SET MEDIA (profile image / CV) ===');
    console.log('Body:', req.body);

    const { profileImage, profileImagePublicId, cvUrl, cvPublicId } = req.body;

    if (!profileImage && !cvUrl) {
      return res.status(400).json({ message: 'No media provided' });
    }

    let info = await PersonalInfo.findOne();
    if (!info) {
      info = await PersonalInfo.create({});
    }

    const updateData = {};

    if (profileImage && profileImagePublicId) {
      if (info.profileImagePublicId && info.profileImagePublicId !== profileImagePublicId) {
        await deleteFromCloudinary(info.profileImagePublicId, 'image');
      }
      updateData.profileImage = profileImage;
      updateData.profileImagePublicId = profileImagePublicId;
    }

    if (cvUrl && cvPublicId) {
      if (info.cvPublicId && info.cvPublicId !== cvPublicId) {
        await deleteFromCloudinary(info.cvPublicId, 'raw');
      }
      updateData.cvUrl = cvUrl;
      updateData.cvPublicId = cvPublicId;
    }

    await info.update(updateData);
    const updatedInfo = await PersonalInfo.findByPk(info.id);

    console.log('✅ Media saved');
    res.json(updatedInfo);
  } catch (error) {
    console.error('❌ Set media error:', error);
    res.status(400).json({ message: error.message });
  }
};