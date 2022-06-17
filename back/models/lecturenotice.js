const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class LectureNotice extends Model {
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
        author: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        LectureId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        TeacherId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        StudentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        file: {
          type: DataTypes.STRING(600),
          allowNull: true,
        },
        hit: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        modelName: "LectureNotice",
        tableName: "lectureNotices",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.LectureNotice.belongsTo(db.User);
  }
};
