const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class MainBanner extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        title: {
          type: DataTypes.STRING(200), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: true, // 필수
        },
        content: {
          type: DataTypes.STRING(600),
          allowNull: true, // 필수
        },
        imagePath: {
          type: DataTypes.STRING(300),
          allowNull: false, // 필수
        },
      },
      {
        modelName: "MainBanner",
        tableName: "mainBanners",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
