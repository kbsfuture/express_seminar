const express = require("express");
const Comment = require("../schemas/comments");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const comment = await Comment.create({
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);
    const result = await Comment.populate(comment, { path: "commenter" });
    // populate를 통해 댓글의 작성자 정보를 가져와 댓글 객체에 추가하는 작업을 수행
    // populate 메서드를 사용하여 문서를 가져올 때, 해당 문서와 연결된 다른 컬렉션(모델)의 정보를 가져오려면
    // 스키마에서 ref 필드가 지정되어 있어야 합니다
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router
  .route("/:id")
  .patch(async (req, res, next) => {
    try {
      const result = await Comment.updateOne(
        {
          _id: req.params.id,
        },
        {
          comment: req.body.comment,
        }
      );
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await Comment.deleteOne({ _id: req.params.id });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
