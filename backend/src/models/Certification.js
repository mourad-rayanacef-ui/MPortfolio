const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Certification = sequelize.define('Certification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    issuer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logoPublicId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certificateUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    certificatePublicId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    educationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'educations',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'certifications'
  });
  
  return Certification;
};