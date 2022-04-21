const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        profileImage: {
          type: DataTypes.STRING(600), //  프로필사진
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
        username: {
          type: DataTypes.STRING(60), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
        },
        mobile: {
          type: DataTypes.STRING(30),
          allowNull: false, // 필수
        },
        email: {
          type: DataTypes.STRING(60), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
          unique: true, // 고유한 값
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        address: {
          type: DataTypes.STRING(300), // 주소
          allowNull: true,
        },
        detailAddress: {
          type: DataTypes.STRING(300), // 상세주소
          allowNull: true,
        },
        identifyNum: {
          type: DataTypes.STRING(100), // 주민등록번호
          allowNull: true,
        },
        teaCountry: {
          type: DataTypes.STRING(100), // 강사 나라
          allowNull: true,
        },
        teaLanguage: {
          type: DataTypes.STRING(100), // 강사 언어
          allowNull: true,
        },
        adminMemo: {
          type: DataTypes.TEXT, // 관리자 메모
          allowNull: true,
        },
        bankNo: {
          type: DataTypes.STRING(50), // 계좌번호
          allowNull: true,
        },
        bankName: {
          type: DataTypes.STRING(100), // 은행이름
          allowNull: true,
        },
        teaMemo: {
          type: DataTypes.TEXT, // 강사 메모
          allowNull: true,
        },
        stuNo: {
          type: DataTypes.INTEGER, // 학생번호
          allowNull: true,
        },
        stuLanguage: {
          type: DataTypes.STRING(100), // 학생 언어
          allowNull: true,
        },
        birth: {
          type: DataTypes.DATE, // 출생
          allowNull: false, // 필수
        },
        stuCountry: {
          type: DataTypes.STRING(100), // 학생 나라
          allowNull: true,
        },
        stuLiveCon: {
          type: DataTypes.STRING(100), // 학생 현재 살고있는 나라
          allowNull: true,
        },
        sns: {
          type: DataTypes.STRING(50), // sns
          allowNull: true,
        },
        snsId: {
          type: DataTypes.STRING(50), // sns아이디
          allowNull: true,
        },
        stuJob: {
          type: DataTypes.STRING(50), // 학생 직업
          allowNull: true,
        },
        stuPayDay: {
          type: DataTypes.STRING(100), // 학생 결제 일
          allowNull: true,
        },
        stuPayCount: {
          type: DataTypes.INTEGER, // 학생 결제 횟수
          allowNull: true,
          defaultValue: 0,
        },
        stuMemo: {
          type: DataTypes.TEXT, // 학생 메모
          allowNull: true,
        },
        stuReview: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        gender: {
          type: DataTypes.STRING(5),
          allowNull: false, // 필수
        },
        partDate: {
          type: DataTypes.STRING(100), // 등록일
          allowNull: true,
        },
        fireDate: {
          type: DataTypes.STRING(100), // 해지일
          allowNull: true,
        },
        isFire: {
          type: DataTypes.BOOLEAN, // 강사 해지 여부
          allowNull: true,
          defaultValue: false,
        },
        level: {
          // 사용자 권한 [1 : 일반학생, 2 : 강사, 3: 운영자, 4: 최고관리자, 5: 개발사]
          type: DataTypes.INTEGER,
          allowNull: false, //
          defaultValue: 1,
        },
      },
      {
        modelName: "User",
        tableName: "users",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Participant);
    db.User.hasMany(db.Payment);
  }
};
