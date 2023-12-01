const express = require("express");

const handlebars = require("express-handlebars");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongodbConnection = require("./configs/mongodb-connection");

const postService = require("./services/post-service");

const { ObjectId } = require("mongodb");

app.engine(
  "handlebars",
  handlebars.create({
    helpers: require("./configs/handlebars-helper"),
  }).engine
);
app.set("view engine", "handlebars");

app.set("views", __dirname + "/viewso");
//뷰 디렉토리를 views로 설정

app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  try {
    const [posts, paginator] = await postService.list(collection, page, search);
    res.render("home", { title: "test bulletin", search, paginator, posts });
  } catch (error) {
    console.error(error);
    res.render("home", { title: "test bulletin" }); // 에러가 나는 경우는 빈값으로 렌더링
  }
});

app.get("/write", (req, res) => {
  res.render("write", { title: "test bulletin", mode: "create" });
});

app.get("/modify/:id", async (req, res) => {
  const { id } = req.params;
  const post = await postService.getPostById(collection, req.params.id);
  console.log(post);
  res.render("write", { title: "test bulletino", mode: "modify", post });
});

//게시글 수정 api

app.post("/modify", async (req, res) => {
  const { id, title, writer, password, content } = req.body;

  const post = {
    title,
    writer,
    password,
    content,
    createdDt: new Date().toISOString(),
  };

  try {
    // 게시글 업데이트를 시도합니다.
    await postService.updatePost(collection, id, post);
    // 업데이트에 성공하면 상세 페이지로 리다이렉트합니다.
    res.redirect(`/detail/${id}`);
  } catch (error) {
    // 업데이트 중 오류가 발생하면 오류 메시지를 반환합니다.
    console.error("Post update failed:", error);
    res.status(500).send("An error occurred while updating the post.");
  }
});

//글쓰기 api
app.post("/write", async (req, res) => {
  const post = req.body;
  console.log(post);

  const result = await postService.writePost(collection, post);
  console.log(result);
  res.redirect(`/detail/${result.insertedId}`);
  // redirect로 인해 app.get("/detail/:id")로 넘어감
});

//상세페이지 api
app.get("/detail/:id", async (req, res) => {
  // id 정보를 db에 넘겨서 게시글의 데이터를 가져옴
  const result = await postService.getDetailPost(collection, req.params.id);
  console.log(result);

  res.render("detail", { title: "test bulletn", post: result });
});

app.post("/check-password", async (req, res) => {
  const { id, password } = req.body;

  const post = await postService.getPostByIdAndPassword(collection, {
    id,
    password,
  });

  //   데이터가 있으면 isExist true, 없으면 isExist false
  if (!post) {
    return res.status(400).json({ isExist: false });
  } else {
    return res.json({ isExist: true });
  }
});

app.delete("/delete", async (req, res) => {
  const { id, password } = req.body;
  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      password: password,
    });

    if (result.deletedCount !== 1) {
      console.log("삭제 실패");
      return res.json({ isSuccess: false });
    }
    return res.json({ isSuccess: true });
  } catch (error) {
    //에러가 난 경우의 처리

    console.error(error);
    return res.json({ isSuccess: false });
  }
});

app.post("/write-comment", async (req, res) => {
  //body에서 data를 가져오기
  const { id, name, password, comment } = req.body;

  const post = await postService.getPostById(collection, id);

  if (post.comments) {
    post.comments.push({
      idx: post.comments.length + 1,
      name,
      password,
      comment,
      createdDt: new Date().toISOString(),
    });
  } else {
    post.comments = [
      {
        idx: 1,
        name,
        password,
        comment,
        createdDt: new Date().toISOString,
      },
    ];
  }

  postService.updatePost(collection, id, post);
  return res.redirect(`/detail/${id}`);
});

//댓글 삭제

app.delete("/delete-comment", async (req, res) => {
  const { id, idx, password } = req.body;
  const post = await collection.findOne(
    {
      _id: new ObjectId(id),
      comments: { $elemMatch: { idx: parseInt(idx), password } },
    },

    postService.projectionOption
  );
  console.log(post);
  if (!post) {
    return res.json({ isSuccess: false });
  }
  post.comments = post.comments.filter((comment) => comment.idx != idx);
  postService.updatePost(collection, id, post);
  return res.json({ isSuccess: true });
});

let collection;
app.listen(3001, async () => {
  console.log("onlineforum server start");
  const mongoClient = await mongodbConnection();
  collection = mongoClient.db("boardo").collection("soljenni");
  //   collection은 특정 db의 특정 collection을 의미합니다
  console.log("mongodb connected");
});

//monbodb 연결할때 ip주소 포함
