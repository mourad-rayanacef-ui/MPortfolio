const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PersonalInfo = sequelize.define(
    'PersonalInfo',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      shortBio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      github: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      twitter: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instagram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalExperience: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currentJob: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currentCompany: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastProject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currentFocus: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImagePublicId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cvUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cvPublicId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: 'personal_infos',
    }
  );

  return PersonalInfo;
};