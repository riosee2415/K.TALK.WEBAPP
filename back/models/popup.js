const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Popup extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        imagePath: {
          type: DataTypes.STRING(300), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
        },
        useYn: {
          type: DataTypes.BOOLEAN,
          allowNull: true, // 필수
        },
      },
      {
        modelName: "Popup",
        tableName: "popups",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
