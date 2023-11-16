const express = require("express");
const User = require("../schemas/user");

const router = express.Router();

router.route("/").get(async (req, res, next) => {
  try {
    const users = await User.find({});
    res.render("mongoose", { users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
// 현재 모듈을 다른 파일에서 사용할 수 있도록 내보내는 역할
// module.exports는 현재 모듈에서 내보내고자 하는 객체나 함수를 지정하는 방법 중 하나.
