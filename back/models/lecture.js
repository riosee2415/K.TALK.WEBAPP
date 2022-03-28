const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Lecture extends Model {
  static init(sequelize) {
    return super.init(
      {
        time: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        day: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        count: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        course: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        lecDate: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        lecTime: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        startLv: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        endLv: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        endDate: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        memo: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        TeacherId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        teacherName: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        zoomLink: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },
        zoomPass: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "Lecture",
        tableName: "lectures",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Lecture.hasMany(db.Participant);
  }
};
