const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Lecture extends Model {
  static init(sequelize) {
    return super.init(
      {
        course: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        lecDate: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        lecTime: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        startLv: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        endLv: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        endDate: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        memo: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "Lecture",
        tableName: "lectures",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
