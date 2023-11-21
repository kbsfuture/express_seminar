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

app.get("/", (req, res) => {
  try {
    res.render("home", { title: "test bulletin", message: "ahente" });
  } catch (error) {
    console.error(error);
    res.render("home", { title: "test bulletin" }); // 에러가 나는 경우는 빈값으로 렌더링
  }
});

app.get("/write", (req, res) => {
  res.render("write", { title: "test bulletin" });
});

app.post("/write", async (req, res) => {
  const post = req.body;
  console.log(post);

  const result = await postService.writePost(collection, post);
  console.log(result);
  res.redirect("/detail/${result.insertedId}");
});

app.get("/detail/:id", async (req, res) => {
  res.render("detail", { title: "test bulle" });
});

let collection;
app.listen(3001, async () => {
  console.log("onlineforum server started");
  const mongoClient = await mongodbConnection();
  collection = mongoClient.db("boardo").collection("soljenni");
  console.log("mongodb connected");
});

//monbodb 연결할때 ip주소 포함
