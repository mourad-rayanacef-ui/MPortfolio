const { sequelize } = require('../config/database');

// Importer les modèles
const Skill = require('./Skill')(sequelize);
const Project = require('./Project')(sequelize);
const Education = require('./Education')(sequelize);
const Certification = require('./Certification')(sequelize);
const Course = require('./Course')(sequelize);
const PersonalInfo = require('./PersonalInfo')(sequelize);
const User = require('./User')(sequelize);
const Experience = require('./Experience')(sequelize);

// Définir les relations
// Education - Certification
Education.hasMany(Certification, { foreignKey: 'educationId' });
Certification.belongsTo(Education, { foreignKey: 'educationId' });

// Education - Course
Education.hasMany(Course, { foreignKey: 'educationId' });
Course.belongsTo(Education, { foreignKey: 'educationId' });

// Education - Experience (if you want to link experiences to education)
// Education.hasMany(Experience, { foreignKey: 'educationId' });
// Experience.belongsTo(Education, { foreignKey: 'educationId' });

module.exports = {
  sequelize,
  Skill,
  Project,
  Education,
  Certification,
  Course,
  PersonalInfo,
  User,
  Experience
};