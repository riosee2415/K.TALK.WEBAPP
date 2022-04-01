const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Book extends Model {
  static init(sequelize) {
    return super.init(
      {
        thumbnail: {
          type: DataTypes.STRING(600),
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        file: {
          type: DataTypes.STRING(600),
          allowNull: false,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "Book",
        tableName: "books",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Book.belongsTo(db.BookFolder);
  }
};
