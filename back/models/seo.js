const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Seo extends Model {
  static init(sequelize) {
    return super.init(
      {
        // 키워드, 홈페이지 설명
        type: {
          type: DataTypes.STRING(100), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
        },
        content: {
          type: DataTypes.STRING(500),
          allowNull: false, // 필수
        },
      },
      {
        modelName: "Seo",
        tableName: "seos",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
