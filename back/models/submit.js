const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Submit extends Model {
  static init(sequelize) {
    return super.init(
      {
        file: {
          type: DataTypes.STRING(600),
          allowNull: false, // 필수
        },
        isComplete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "Submit",
        tableName: "submits",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Submit.belongsTo(db.Lecture);
    db.Submit.belongsTo(db.Homework);
  }
};
