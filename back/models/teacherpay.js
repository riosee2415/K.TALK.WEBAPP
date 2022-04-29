const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class TeacherPay extends Model {
  static init(sequelize) {
    return super.init(
      {
        type: {
          type: DataTypes.STRING(100), // ["기본수당" | "연장수당" | "회의수당" | "등록수당"]
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        modelName: "TeacherPay",
        tableName: "teacherPays",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.TeacherPay.belongsTo(db.User);
    db.TeacherPay.belongsTo(db.Lecture);
  }
};
