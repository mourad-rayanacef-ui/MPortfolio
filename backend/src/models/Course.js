const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
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
    tableName: 'courses'
  });
  
  return Course;
};