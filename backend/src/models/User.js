const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    timestamps: true,
    tableName: 'users',
    hooks: { beforeCreate: async (user) => { if (user.password) user.password = await bcrypt.hash(user.password, 10); } }
  });
  User.prototype.validatePassword = async function(password) { return bcrypt.compare(password, this.password); };
  return User;
};