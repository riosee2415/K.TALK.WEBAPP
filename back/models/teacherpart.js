const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class TeacherPart extends Model {
  static init(sequelize) {
    return super.init(
      {
        isFire: {
          type: DataTypes.BOOLEAN, // 강사 해지 여부
          allowNull: true,
          defaultValue: false,
        },
        partDate: {
          type: DataTypes.STRING(100), // 등록일
          allowNull: false,
        },
        fireDate: {
          type: DataTypes.STRING(100), // 해지일
          allowNull: false,
        },
      },
      {
        modelName: "TeacherPart",
        tableName: "teacherParts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.TeacherPart.belongsTo(db.User);
  }
};
