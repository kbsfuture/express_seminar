const express = require("express");

const handlebars = require("express-handlebars");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongodbConnection = require("./configs/mongodb-connection");

const postService = require("./services/post-service");

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
  res.render("write", { title: "test bulletin" });
});

//글쓰기 api
app.post("/write", async (req, res) => {
  const post = req.body;
  console.log(post);

  const result = await postService.writePost(collection, post);
  console.log(result);
  res.redirect(`/detail/${result.insertedId}`);
});

//상세페이지 api
app.get("/detail/:id", async (req, res) => {
  // id 정보를 db에 넘겨서 게시글의 데이터를 가져옴
  const result = await postService.getDetailPost(collection, req.params.id);
  console.log(result);
  res.render("detail", { title: "test bulletn", post: result });
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
