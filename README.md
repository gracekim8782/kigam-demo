# KIGAM 지질도 음성 검색 데모
브라우저에서 [Web Speech API](https://wicg.github.io/speech-api/)로 음성 인식한 결과를 자바스크립트 웹소켓 라이브러리 [Socket.io](https://socket.io/)를 이용해 서버에 전송

서버에서 [ETRI API](https://aiopen.etri.re.kr/service_list.php) 또는 [Google Cloud Natural Language API](https://cloud.google.com/natural-language/docs/reference/rest)를 호출하고 결과값을 다시 브라우저에 반환

## 개발 환경

- Node.js v16.13.0
- Google Cloud Natural Language API v1

## 시작하기

```
$ npm install
```

최상위 폴더에서 `npm install`로 필요한 패키지를 설치

### ETRI API Key 발급
[Open API Key 발급 및 관리 페이지](https://aiopen.etri.re.kr/key_main.php)에서 키 발급 신청

### Google Cloud NLP API Key 발급
[Google Cloud console](https://console.cloud.google.com)에서 새로운 프로젝트 생성
<img width="1552" src="https://user-images.githubusercontent.com/105704549/169734659-69f46a11-5c9a-4340-b624-d172cf1253b4.png">

결제 계정 만들기

<img width="1552" src="https://user-images.githubusercontent.com/105704549/169735415-c1cbd462-15b5-409a-adb3-e1fd85b38ddc.png">
<img width="1552" src="https://user-images.githubusercontent.com/105704549/169735694-66667212-8720-40f6-8a58-99ddbc28ee76.png">

API Key 발급

왼쪽에 ≡ 버튼 눌러서 API 및 서비스 -> 사용 설정된 API 및 서비스 페이지로 이동

위 쪽에 + API 및 서비스 사용 설정 -> Natural Language를 검색해 Cloud Nautral Language API 선택

<img width="1552" src="https://user-images.githubusercontent.com/105704549/169735385-de966fc6-8ae9-4986-ab68-457f6774d881.png">
<img width="1552" src="https://user-images.githubusercontent.com/105704549/169735394-a769ab11-a401-4592-b7dc-fbad4cf92849.png">
<img width="1552" src="https://user-images.githubusercontent.com/105704549/169735397-b4a6999b-bb84-453e-86e0-5f6d65266307.png">
<img width="1552" src="https://user-images.githubusercontent.com/105704549/169735402-e4587b95-2472-416d-9a09-cf6fe508185e.png">

### API Key 입력
최상위 폴더의 .env 파일에 발급 받은 키를 입력

## 실행하기

```
$ npm start
```

최상위 폴더에서 `npm start`로 서버 실행 후 `http://localhost:3000/` 주소로 이동
