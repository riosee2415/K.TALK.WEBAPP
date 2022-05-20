const DataTypes = require("sequelize");
const { Model } = DataTypes;

//제목, 내용 강의아이디, 삭제여부

module.exports = class LectureMemo extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "LectureMemo",
        tableName: "lectureMemos",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.LectureMemo.belongsTo(db.Lecture);
  }
};
