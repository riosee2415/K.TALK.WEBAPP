const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Participant extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        temp: {
          type: DataTypes.INTEGER, // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false,
          defaultValue: 0, // 필수
        },
      },
      {
        modelName: "Participant",
        tableName: "participants",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Participant.belongsTo(db.User);
    db.Participant.belongsTo(db.Lecture);
  }
};
