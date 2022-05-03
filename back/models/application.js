const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Application extends Model {
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
        nationality: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        countryOfResidence: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        languageYouUse: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        phoneNumber2: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        classHour: {
          type: DataTypes.STRING(500),
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        terms: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        isPaid: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        payDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        timeDiff: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        wantStartDate: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        teacher: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        freeTeacher: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        isDiscount: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        meetDate: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        level: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        job: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        purpose: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        modelName: "Application",
        tableName: "applications",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
