const {
    Model,
    DataTypes
} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

//define table clumns and configuration
User.init({
    //define an id column
    id: {
        //use the special sequelize datatypes object brode what type of datait is
        type: DataTypes.INTEGER,
        // equivalent of SQL NOT NULL
        allowNull: false,
        //instruct that this is the primary key
        primaryKey: true,
        //turn on auto increment
        autoIncrement: true
    },
    //define a username column
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    //define email column
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        //cannot be duplicates
        unique: true,
        //if allowNull = false we can run a validator
        validate: {
            isEmail: true
        }
    },
    //define password column
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // must be at least 4 characters
            len: [4]
        }
    }
 }, {
    hooks: {
        // set up beforeCreate lifecycle "hook" functionality
  async beforeCreate(newUserData) {
    newUserData.password = await bcrypt.hash(newUserData.password, 10);
    return newUserData;
  },
  // set up beforeUpdate lifecycle "hook" functionality
  async beforeUpdate(updatedUserData) {
    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
    return updatedUserData;
  }
},
    
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
});

module.exports = User;