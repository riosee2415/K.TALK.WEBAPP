const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class AcceptRecord extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        ip: {
          type: DataTypes.STRING(50), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
        },
      },
      {
        modelName: "AcceptRecord",
        tableName: "acceptRecords",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
