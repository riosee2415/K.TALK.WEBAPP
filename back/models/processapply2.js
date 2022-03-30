const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class ProcessApply2 extends Model {
  static init(sequelize) {
    return super.init(
      {
        firstName: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        dateOfBirth: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        gmailAddress: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        loginPw: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        countryofResidence: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        isComplete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        modelName: "ProcessApply2",
        tableName: "processApply2s",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
