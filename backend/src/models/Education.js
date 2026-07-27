const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Education = sequelize.define(
    'Education',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      university: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startYear: {
        type: DataTypes.INTEGER,
      },
      expectedGraduationYear: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      coursesTaken: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      certificateUrl: {
        type: DataTypes.STRING,
      },
      certificatePublicId: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      tableName: 'educations',
    }
  );

  return Education;
};