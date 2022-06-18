const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class NormalConnect extends Model {
  static init(sequelize) {
    return super.init(
      {
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "NormalConnect",
        tableName: "normalConnects",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.NormalConnect.belongsTo(db.NormalNotice);
    db.NormalConnect.belongsTo(db.User);
  }
};
