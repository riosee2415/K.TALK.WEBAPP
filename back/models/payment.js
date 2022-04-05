const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Payment extends Model {
  static init(sequelize) {
    return super.init(
      {
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "Payment",
        tableName: "Payments",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Payment.belongsTo(db.User);
    db.Payment.belongsTo(db.PayClass);
  }
};
