const express = require("express");

const handlebars = require("express-handlebars");

const app = express();

const mongodbConnection = require("./configs/mongodb-connection");

app.engine("handlebars", handlebars.engine());

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

app.get("/detail/:id", async (req, res) => {
  res.render("detail", { title: "test bulle" });
});

let collection;
app.listen(3001, async () => {
  console.log("onlineforum server started");
  const mongoClient = await mongodbConnection();
  console.log("mongodb connected");
});

//monbodb 연결할때 ip주소 포함