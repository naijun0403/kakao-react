# kakao-react
카카오톡 반응 리엑션 모듈

## 오픈소스 라이선스
- [querystring](https://github.com/Gozala/querystring/blob/master/LICENSE)

## example
```js
const { ReactClient, ReactionType } = require('kakao-react');

const client = ReactClient.create({
    accessToken: '',
    deviceUUID: ''
});

client.react(channelId, logId, ReactionType.HEART, linkId); // linkId는 오픈채팅일 경우에만 넣습니다.

client.sync(channelId, startLogId, endLogId);

client.member(channelId, logId);
```