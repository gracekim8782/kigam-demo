const path = require("path");
const http = require("http");
const cors = require("cors");
const express = require("express");
const SocketIO = require("socket.io");
const dotenv = require("dotenv");
const axios = require("axios");

const app = express();
const port = 3000;

// .env에서 API_KEY 가져오기
dotenv.config({ path: ".env", encoding: "utf8" });
const API_KEY = process.env.OPEN_API_KEY;

const openApiURL = "http://aiopen.etri.re.kr:8000/WiseNLU";
// 분석 코드는 개체명 인식으로 설정
const analysisCode = "ner";

// 서버 구축 함수
function setupServer() {
  app.use(cors());
  app.use("/public", express.static("public"));
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/webspeech.html"));
  });

  const server = http.createServer(app).listen(port);

  const io = SocketIO(server, {
    allowEIO3: true, // false by default
  });

  io.on("connect", (socket) => {
    // 클라이언트에서 음성 인식 결과 보낼 때 개체명 인식 함수 호출
    socket.on("ner", (audioTranscript) => {
      getNamedEntity(audioTranscript, socket);
    });
  });
}

// ETRI 개체명 인식 API에 접근하여 개체명 추출하기
async function getNamedEntity(audioTranscript, socket) {
  var entityList = [];
  var returnText;
  await axios
    .post(
      openApiURL,
      {
        access_key: API_KEY,
        argument: { text: audioTranscript, analysis_code: analysisCode },
      },
      { headers: { "Content-Type": "application/json; charset=UTF-8" } }
    )
    .then(function (response) {
      if (typeof response !== "undefined") {
        const returnObject = response.data;
        if (returnObject.result == 0) {
          // 개체명 인식 성공
          const words = response.data.return_object.sentence[0].NE;
          // 개체명으로 이루어진 배열 생성
          for (var word of words) {
            entityList.push(word.text);
          }
          returnText = "개체명 인식 결과: [" + entityList.toString() + "] ";
        } else {
          // API 호출은 성공했으나 어떠한 이유로 개체명 인식에 실패 예) API 키가 잘못되었음, 분석할 문장이 없음
          returnText = "개체명 인식 실패 이유: " + returnObject.reason + " ";
        }
      }
    })
    .catch(function (error) {
      // API 호출 실패
      returnText = "에러: " + error.response.data.reason + " ";
    });
  // 브라우저로 개체명 인식 결과를 소켓을 통해 반환
  socket.emit("ner-results", returnText);
}

// 서버 구축 함수 호출
setupServer();
