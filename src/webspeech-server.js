const path = require("path");
const cors = require("cors");
const express = require("express");
const SocketIO = require("socket.io");
const dotenv = require("dotenv");
const axios = require("axios");

const app = express();
const port = 3000;

// .env에서 API_KEY 가져오기
dotenv.config({ path: ".env", encoding: "utf8" });
const ETRI_API_KEY = process.env.ETRI_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// 서버 구축 함수
function setupServer() {
  app.use(cors());
  app.use("/public", express.static("public"));
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/webspeech.html"));
  });

  const server = app.listen(port, () => {
    console.log("localhost:3000");
  });

  const io = SocketIO(server, {
    allowEIO3: true, // false by default
  });

  io.on("connect", (socket) => {
    // 클라이언트에서 음성 인식 결과 보낼 때 개체명 인식 함수 호출
    socket.on("ner", (text) => {
      etriEntity(text, socket);
      googleEntity(text, socket);
    });
  });
}

// Google Cloud NLP API중 analyzeEntities 사용
async function googleEntity(text, socket) {
  googleApiURL = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${GOOGLE_API_KEY}`;

  let postData = {
    encodingType: "UTF8",
    document: {
      type: "PLAIN_TEXT",
      content: text,
    },
  };

  var returnText;

  try {
    const response = await axios.post(googleApiURL, postData);
    // 개체명으로 이루어진 배열 생성
    var entityList = [];
    for (var entity of response.data.entities) {
      entityList.push(entity.name);
    }
    returnText =
      "Google NLP API 개체명 인식 결과: [" + entityList.toString() + "] ";
  } catch (error) {
    // API 호출 실패
    returnText = "Google NLP API 에러: " + error.response.statusText + " ";
  }

  // 브라우저로 개체명 인식 결과를 소켓을 통해 반환
  socket.emit("ner-results", returnText);
}

// ETRI 개체명 인식 API에 접근하여 개체명 추출하기
async function etriEntity(text, socket) {
  const etriApiURL = "http://aiopen.etri.re.kr:8000/WiseNLU";
  // 분석 코드는 개체명 인식으로 설정
  const analysisCode = "ner";

  let postData = {
    access_key: ETRI_API_KEY,
    argument: { text: text, analysis_code: analysisCode },
  };

  let config = {
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  };

  var returnText;

  try {
    // 개체명 인식 ETRI API 호출 성공
    const response = await axios.post(etriApiURL, postData, config);
    // 개체명으로 이루어진 배열 생성
    var entityList = [];
    for (var entity of response.data.return_object.sentence[0].NE) {
      entityList.push(entity.text);
    }
    returnText = "ETRI API 개체명 인식 결과: [" + entityList.toString() + "]";
  } catch (error) {
    // API 호출 실패
    returnText = "ETRI API 에러: " + error;
  }

  // 브라우저로 개체명 인식 결과를 소켓을 통해 반환
  socket.emit("ner-results", returnText);
}

// 서버 구축 함수 호출
setupServer();