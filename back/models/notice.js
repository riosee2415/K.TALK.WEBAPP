const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Notice extends Model {
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
          allowNull: false,
        },
        senderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        receiverId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        LectureId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        file: {
          type: DataTypes.STRING(600),
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
