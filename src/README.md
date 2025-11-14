# 독거노인 관리 시스템 - 프로젝트 구조

## 📁 폴더 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   │   ├── Header.jsx   # 헤더 컴포넌트
│   │   ├── Layout.jsx   # 레이아웃 컴포넌트
│   │   ├── MemoModal.jsx # 메모 모달 컴포넌트
│   │   └── index.js     # export 정리
│   └── ui/              # UI 전용 컴포넌트
│       ├── CharacterSlider.jsx # 캐릭터 슬라이더
│       ├── Robot.jsx    # 로봇 캐릭터
│       ├── Human.jsx    # 사람 캐릭터
│       ├── VoiceWave.jsx # 음성 파형
│       └── index.js     # export 정리
├── hooks/               # 커스텀 훅
│   ├── useClock.js      # 실시간 시계 훅
│   ├── useCharacterSlider.js # 캐릭터 슬라이더 훅
│   ├── useTouchSwipe.js # 터치 스와이프 훅
│   └── index.js         # export 정리
├── utils/               # 유틸리티 함수
│   ├── emotionUtils.js  # 감정 관련 유틸리티
│   ├── dateUtils.js     # 날짜 관련 유틸리티
│   ├── validationUtils.js # 검증 관련 유틸리티
│   └── index.js         # export 정리
├── constants/           # 상수 정의
│   ├── index.js         # 기본 상수들
│   └── mockData.js      # Mock 데이터
├── types/               # 타입 정의
│   └── index.js         # 타입 정의들
├── context/             # React Context (향후 확장)
├── assets/              # 정적 자산
└── pages/               # 페이지 컴포넌트
    ├── Dashboard.jsx    # 기존 대시보드
    ├── DashboardRefactored.jsx # 리팩토링된 대시보드
    ├── UserApp.jsx      # 기존 사용자 앱
    ├── UserAppRefactored.jsx # 리팩토링된 사용자 앱
    ├── UserDetail.jsx   # 사용자 상세 페이지
    └── UserAdd.jsx      # 사용자 추가 페이지
```

## 🎯 컴포넌트 분리 원칙

### 1. **Common Components** (`src/components/common/`)
- 여러 페이지에서 공통으로 사용되는 컴포넌트
- 예: Header, Layout, Modal 등

### 2. **UI Components** (`src/components/ui/`)
- 특정 기능에 특화된 UI 컴포넌트
- 예: CharacterSlider, Robot, Human 등

### 3. **Custom Hooks** (`src/hooks/`)
- 재사용 가능한 로직을 담은 커스텀 훅
- 예: useClock, useCharacterSlider, useTouchSwipe

### 4. **Utils** (`src/utils/`)
- 순수 함수들로 구성된 유틸리티
- 예: emotionUtils, dateUtils, validationUtils

### 5. **Constants** (`src/constants/`)
- 애플리케이션 전반에서 사용되는 상수들
- 예: USER_STATUS, EMOTION_COLORS, MOCK_DATA

## 🔧 사용 방법

### 컴포넌트 import
```javascript
// 개별 import
import { Header } from '../components/common/Header';

// index를 통한 import
import { Header, Layout, MemoModal } from '../components/common';
```

### 훅 사용
```javascript
import { useClock, useCharacterSlider } from '../hooks';

function MyComponent() {
  const { timeString, dateString } = useClock();
  const { character, nextCharacter, prevCharacter } = useCharacterSlider();
  // ...
}
```

### 유틸리티 사용
```javascript
import { getEmotionColor, calculateAge, isValidPhoneNumber } from '../utils';

const color = getEmotionColor('urgent');
const age = calculateAge('1990-01-01');
const isValid = isValidPhoneNumber('010-1234-5678');
```

## 🚀 장점

1. **재사용성**: 컴포넌트와 훅을 여러 곳에서 재사용 가능
2. **유지보수성**: 코드가 체계적으로 분리되어 수정이 용이
3. **테스트 용이성**: 각 모듈을 독립적으로 테스트 가능
4. **확장성**: 새로운 기능 추가 시 기존 구조를 유지하며 확장 가능
5. **가독성**: 코드의 역할이 명확하게 분리되어 이해하기 쉬움

## 📝 향후 개선 사항

1. **Context API**: 전역 상태 관리를 위한 Context 추가
2. **API Layer**: 실제 API 호출을 위한 서비스 레이어 추가
3. **Error Boundary**: 에러 처리를 위한 Error Boundary 추가
4. **Loading States**: 로딩 상태 관리를 위한 컴포넌트 추가
5. **Testing**: 각 컴포넌트와 훅에 대한 테스트 코드 추가




