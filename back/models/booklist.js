const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class BookList extends Model {
  static init(sequelize) {
    return super.init(
      {
        temp: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
          defaultValue: 0,
        },
      },
      {
        modelName: "BookList",
        tableName: "bookLists",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.BookList.belongsTo(db.Lecture);
    db.BookList.belongsTo(db.Book);
  }
};
