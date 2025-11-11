# MP4 영상 캐릭터 사용 가이드

## 개요
AI 음성과 동기화되는 MP4 영상 캐릭터 기능이 추가되었습니다. AI가 말할 때만 영상이 재생되고, 말을 멈추면 영상도 정지됩니다.

## 사용 방법

### 1. MP4 파일 준비
원하는 AI 캐릭터의 말하는 영상을 MP4 형식으로 준비합니다.

### 2. 파일 배치
준비한 MP4 파일을 다음 경로에 복사합니다:
```
public/videos/ai-character.mp4
```

### 3. 캐릭터 선택
앱을 실행하고 홈 화면에서 "영상 상담사 🎥" 캐릭터를 선택합니다.

### 4. 동작 확인
- "AI와 대화하기" 버튼을 클릭
- AI가 말하기 시작하면 영상이 자동으로 재생됩니다
- AI가 말을 멈추면 영상이 정지되고 처음으로 돌아갑니다

## 파일 경로 변경

다른 경로나 다른 이름의 MP4 파일을 사용하려면 `src/pages/UserAppPage.jsx` 파일의 다음 부분을 수정하세요:

```javascript
// 비디오 파일 경로 (public 폴더에 넣거나 URL로 변경 가능)
const videoSrc = '/videos/ai-character.mp4';
```

예시:
- 다른 파일명: `const videoSrc = '/videos/my-ai.mp4';`
- 외부 URL: `const videoSrc = 'https://example.com/video.mp4';`

## 구현 세부사항

### VideoCharacter 컴포넌트
- 위치: `src/components/ui/VideoCharacter.jsx`
- Props:
  - `videoSrc`: MP4 파일 경로 (필수)
  - `speaking`: AI 음성 상태 (true/false)
  - `loop`: 영상 반복 재생 여부 (기본값: true)
  - `width`: 영상 너비 (기본값: '400px')
  - `height`: 영상 높이 (기본값: '400px')

### 동기화 메커니즘
1. Web Speech API의 `utterance.onstart` 이벤트로 `speaking` 상태를 `true`로 설정
2. `speaking`이 `true`가 되면 `video.play()` 호출
3. `utterance.onend` 이벤트로 `speaking` 상태를 `false`로 설정
4. `speaking`이 `false`가 되면 `video.pause()` 호출 및 영상 처음으로 리셋

## 영상 제작 팁

1. **길이**: AI 응답 시간을 고려하여 5-10초 정도의 영상 권장
2. **루프**: `loop={true}` 설정 시 영상이 반복되므로 시작과 끝이 자연스럽게 이어지도록 제작
3. **포맷**: H.264 코덱의 MP4 파일 권장 (브라우저 호환성 최고)
4. **해상도**: 400x400px 정도 권장 (화면 크기에 맞게 조정 가능)
5. **파일 크기**: 로딩 속도를 위해 5MB 이하 권장

## 문제 해결

### 영상이 재생되지 않을 때
1. 브라우저 콘솔에서 에러 메시지 확인
2. MP4 파일 경로가 올바른지 확인
3. 브라우저가 해당 코덱을 지원하는지 확인

### 동기화가 맞지 않을 때
1. Web Speech API가 정상 작동하는지 확인
2. 브라우저 개발자 도구로 `speaking` 상태 확인
3. 네트워크 속도가 느린 경우 영상 프리로딩 고려

## 추가 커스터마이징

### 영상 크기 변경
`VideoCharacter` 컴포넌트 호출 시 props로 전달:
```javascript
<VideoCharacter
  videoSrc={videoSrc}
  speaking={speaking}
  width="600px"
  height="600px"
/>
```

### 영상 스타일 변경
`src/components/ui/VideoCharacter.jsx` 파일의 style 객체 수정:
```javascript
style={{
  width,
  height,
  objectFit: 'contain',  // 또는 'cover', 'fill' 등
  borderRadius: '12px'   // 모서리 둥글기
}}
```
