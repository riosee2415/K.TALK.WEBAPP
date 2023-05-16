const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Community extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        title: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
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
        sort: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
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
        modelName: "Community",
        tableName: "communitys",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Community.belongsTo(db.CommunityType);
    db.Community.belongsTo(db.User);
  }
};
