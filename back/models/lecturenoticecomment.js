const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class LectureNoticeComment extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        UserId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(2000), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
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
        // 단계
        parent: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        // 어떤 댓글의 댓글인가?
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        grantparentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        modelName: "LectureNoticeComment",
        tableName: "lectureNoticeComments",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.LectureNoticeComment.belongsTo(db.LectureNotice);
  }
};
