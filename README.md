# KIGAM 지질도 음성 검색 데모
브라우저에서 [Web Speech API](https://wicg.github.io/speech-api/)로 음성 인식한 결과를 자바스크립트 웹소켓 라이브러리 [Socket.io](https://socket.io/)를 이용해 서버에 전송

서버에서 [ETRI 개체명 인식 API](https://aiopen.etri.re.kr/service_list.php)를 호출하고 결과값을 다시 브라우저에 반환

## 개발 환경

- Node.js v16.13.0

## 시작하기

```
$ npm install
```

필요한 패키지들을 설치

### ETRI API Key 발급 & 설정
[Open API Key 발급 및 관리 페이지](https://aiopen.etri.re.kr/key_main.php)에서 키 발급 신청

최상위 폴더의 .env 파일에 발급 받은 키를 입력

## 실행하기

```
$ npm start
```

`npm start`로 서버 실행 후 `http://localhost:3000/` 주소로 이동
