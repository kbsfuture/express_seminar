// 객체를 선언할때 사용 할 수 있는 방법들

// 1) object를 생성해서 객체 생성
// 2) class를 인스턴스화해서 생성
// 3) function을 사용해서 객체 생성

// 객체 => {key: value}

// 1) value - 실제 프로퍼티의 값
// 2) writable - 값을 수정할 수 있는지 여부. false로 설정하면 프로퍼티 값을 수정할 수 없다.
// 3) enumerable - 열거가 가능한지 여부. for in 룹을 사용할 수 있으면 true 반환
// 4) configurable - 프로퍼티 어트리뷰트의 재정의가 가능한지 여부를 판단한다. false일 경우
// 프로퍼티 삭제나 어트리뷰트 변경이 금지된다. 단, writable이 true인 경우 값 변경과 writable을
// 변경하는건 가능하다

// js는 lexical scope를 사용하기 때문에 함수의 상위 스코프가 정의 시점에 평가된다.
// 하지만 this 키워드는 바인딩이 객체가 생성되는 시점에 결정된다.

const mongoose = require("mongoose");

const connecty = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "nodezilla",
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("mongodb connection success");
    })
    .catch((error) => {
      console.error("mongodb connection error", error);
    });
};

module.exports = connecty;

// 1) db 연결
// 2) app.js를 통해 route와 미들웨어 설정
// 3) schema 설정
// 4) 각 route 내에서 url 따고 schema 연동 후 crud 작업
