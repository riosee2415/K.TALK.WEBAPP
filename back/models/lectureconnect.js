const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class LectureConnect extends Model {
  static init(sequelize) {
    return super.init(
      {
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "LectureConnect",
        tableName: "lectureConnects",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.LectureConnect.belongsTo(db.LectureNotice);
    db.LectureConnect.belongsTo(db.User);
  }
};
