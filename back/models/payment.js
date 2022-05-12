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
        type: {
          type: DataTypes.STRING(60),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        bankNo: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        isComplete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        modelName: "Payment",
        tableName: "payments",
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
