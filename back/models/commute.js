const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Commute extends Model {
  static init(sequelize) {
    return super.init(
      {
        time: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
        status: {
          type: DataTypes.STRING(50),
          allowNull: false, // 필수
        },
      },
      {
        modelName: "Commute",
        tableName: "commutes",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Commute.belongsTo(db.Lecture);
    db.Commute.belongsTo(db.User);
  }
};
