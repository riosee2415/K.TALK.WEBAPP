const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class LectureDiary extends Model {
  static init(sequelize) {
    return super.init(
      {
        author: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        process: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        lectureMemo: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "LectureDiary",
        tableName: "lectureDiarys",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.LectureDiary.belongsTo(db.Lecture);
  }
};
