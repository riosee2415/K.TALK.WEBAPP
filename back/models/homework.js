const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Homework extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(300),
          allowNull: false, // 필수
        },
        date: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
        file: {
          type: DataTypes.STRING(600),
          allowNull: false, // 필수
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "Homework",
        tableName: "homeworks",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Homework.belongsTo(db.Lecture);
  }
};
