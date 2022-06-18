const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class NormalNotice extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        author: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        file: {
          type: DataTypes.STRING(600),
          allowNull: true,
        },
        hit: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        modelName: "NormalNotice",
        tableName: "normalNotices",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.NormalNotice.belongsTo(db.User);
  }
};
