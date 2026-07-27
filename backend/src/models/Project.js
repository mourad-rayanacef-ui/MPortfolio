const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: { 
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    techStack: { 
      type: DataTypes.ARRAY(DataTypes.STRING), 
      defaultValue: [] 
    },
    image: { 
      type: DataTypes.STRING 
    },
    imagePublicId: { 
      type: DataTypes.STRING 
    },
    description: { 
      type: DataTypes.TEXT 
    },
    details: { 
      type: DataTypes.TEXT 
    },
    startDate: { 
      type: DataTypes.STRING 
    },
    endDate: { 
      type: DataTypes.STRING 
    },
    challenges: { 
      type: DataTypes.TEXT 
    },
    learnings: { 
      type: DataTypes.TEXT 
    },
    order: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 
    }
  }, { 
    timestamps: true, 
    tableName: 'projects' 
  });
  return Project;
};