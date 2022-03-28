const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class LectureStuMemo extends Model {
  static init(sequelize) {
    return super.init(
      {
        memo: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
      },
      {
        modelName: "LectureStuMemo",
        tableName: "lectureStuMemos",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.LectureStuMemo.belongsTo(db.Lecture);
    db.LectureStuMemo.belongsTo(db.User);
  }
};
