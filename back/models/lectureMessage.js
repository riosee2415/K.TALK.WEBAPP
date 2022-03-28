const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class LectureMessage extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "LectureMessage",
        tableName: "lectureMessages",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.LectureMessage.belongsTo(db.Lecture);
  }
};
