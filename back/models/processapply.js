const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class ProcessApply extends Model {
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
        // 정규과정 등록신청서
        cFirstName: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        cLastName: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        cDateOfBirth: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        cGmailAddress: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        cLoginPw: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        cGender: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        cNationality: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        cCountryofResidence: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        cLanguageYouUse: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        cPhonenumber: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        cSns: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        cSnsId: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        cOccupation: {
          type: DataTypes.STRING(100),
          allowNulll: false,
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
        modelName: "ProcessApply",
        tableName: "processApplys",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
