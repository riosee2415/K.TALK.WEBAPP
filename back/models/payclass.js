const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PayClass extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        discount: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0.0,
        },
        link: {
          type: DataTypes.STRING(600),
          allowNull: false,
        },
        memo: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "PayClass",
        tableName: "payClass",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PayClass.belongsTo(db.Lecture);
  }
};
