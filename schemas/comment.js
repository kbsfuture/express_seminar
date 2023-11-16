const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const commentSchema = new Schema({
  commenter: {
    type: ObjectId,
    required: true,
    ref: "User",
    //mongoose는 모델을 찾을 때 해당 모델의 이름을 기반으로 모델을 찾습니다. 모델을 정의한 스키마와 관련된 파일에서 모델 이름을 지정한 후, 다른 파일에서 모델 이름을 동일하게 사용하면 Mongoose는 그 모델을 찾아 사용합니다.
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema, "commento");
