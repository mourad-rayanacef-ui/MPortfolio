const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Skill = sequelize.define('Skill', {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    category: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    level: { 
      type: DataTypes.INTEGER, 
      defaultValue: 50, 
      validate: { min: 0, max: 100 } 
    },
    icon: { 
      type: DataTypes.STRING, 
      defaultValue: '⚛️' 
    },
    iconType: { 
      type: DataTypes.ENUM('emoji', 'image', 'svg', 'none'), 
      defaultValue: 'emoji' 
    },
    iconUrl: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    iconPublicId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: { 
      type: DataTypes.TEXT 
    },
    since: { 
      type: DataTypes.STRING 
    },
    projects: { 
      type: DataTypes.ARRAY(DataTypes.STRING), 
      defaultValue: [] 
    },
    order: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 
    },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    }
  }, { 
    timestamps: true, 
    tableName: 'skills' 
  });
  return Skill;
};