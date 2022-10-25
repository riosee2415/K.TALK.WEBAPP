const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class AppBoolean extends Model {
  static init(sequelize) {
    return super.init(
      {
        useYn: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        lastUseDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        modelName: "AppBoolean",
        tableName: "appBooleans",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
