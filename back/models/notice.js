const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Notice extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        title: {
          type: DataTypes.STRING(300), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
        },
        type: {
          // ["공지사항", "새소식"]
          type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
          defaultValue: "공지사항",
        },
        isTop: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false, // 필수
        },
        author: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: "관리자",
        },
        hit: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        file: {
          type: DataTypes.STRING(600), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: true,
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
        modelName: "Notice",
        tableName: "notices",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
