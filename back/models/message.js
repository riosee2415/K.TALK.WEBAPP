const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Message extends Model {
  static init(sequelize) {
    return super.init(
      {
        senderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        receiverId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        receiveLectureId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "message",
        tableName: "Messages",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
