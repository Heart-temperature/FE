// 대시보드용 Mock 데이터
export const MOCK_USERS = [
  { 
    id: 'u1', 
    name: '김영희', 
    age: 82, 
    emotion: 'urgent', 
    desc: 'AI 감정분석: 긴급 - 외로움과 불안감 심각', 
    lastCall: '5분 전', 
    phone: '010-1234-5678', 
    address: '서울시 강남구', 
    joinedDate: '2023-03-12', 
    lastActive: '1분 전', 
    gender: '여성', 
    callDuration: '12분', 
    callSummary: '외로움과 불안감이 심각한 수준으로 상담 필요' 
  },
  { 
    id: 'u2', 
    name: '박철수', 
    age: 78, 
    emotion: 'caution', 
    desc: 'AI 감정분석: 주의 - 우울감과 불안감', 
    lastCall: '1시간 전', 
    phone: '010-2345-6789', 
    address: '서울시 서초구', 
    joinedDate: '2023-05-20', 
    lastActive: '30분 전', 
    gender: '남성', 
    callDuration: '8분', 
    callSummary: '우울감과 불안감이 있으나 상담으로 안정화' 
  },
  { 
    id: 'u3', 
    name: '이순자', 
    age: 85, 
    emotion: 'normal', 
    desc: 'AI 감정분석: 정상 - 안정적인 상태', 
    lastCall: '2시간 전', 
    phone: '010-3456-7890', 
    address: '서울시 송파구', 
    joinedDate: '2023-01-15', 
    lastActive: '1시간 전', 
    gender: '여성', 
    callDuration: '5분', 
    callSummary: '안정적인 상태로 일상생활 잘 하고 있음' 
  }
];

// 사용자 상세 정보용 Mock 데이터
export const MOCK_USER_DETAILS = {
  u1: { 
    name: '김영희', 
    age: 82, 
    emotion: 'urgent', 
    phone: '010-1234-5678', 
    address: '서울시 강남구 역삼동 123-45',
    desc: 'AI 감정분석: 긴급 - 외로움과 불안감 심각', 
    lastCall: '5분 전',
    callDuration: '12분',
    callSummary: '외로움과 불안감이 심각한 수준으로 상담 필요',
    gender: '여성',
    medicalHistory: ['고혈압', '당뇨'],
    emergencyContact: '010-9876-5432 (딸)',
    adminMemos: [
      { id: 1, author: '관리자A', date: '2024-07-20', content: '최근 외로움을 많이 타시는 것 같아 주기적인 안부 전화 필요.' },
      { id: 2, author: '관리자B', date: '2024-07-15', content: '넘어짐 언급 있었으나, 현재는 안정 상태. 지속적인 모니터링.' },
    ],
    emotionHistory: [
      { date: '2024-07-15', score: 2, callDuration: '5분' },
      { date: '2024-07-16', score: 3, callDuration: '7분' },
      { date: '2024-07-17', score: 2, callDuration: '6분' },
      { date: '2024-07-18', score: 1, callDuration: '12분' },
      { date: '2024-07-19', score: 2, callDuration: '8분' },
      { date: '2024-07-20', score: 1, callDuration: '10분' },
    ],
    conversationHistory: [
      { date: '2024-07-20', emotion: 'urgent', duration: '10분', summary: '외로움과 불안감 심각, 가족과의 만남을 그리워함.' },
      { date: '2024-07-19', emotion: 'caution', duration: '8분', summary: '기억력 저하 우려, 복용약 잊음.' },
      { date: '2024-07-18', emotion: 'urgent', duration: '12분', summary: '넘어짐 언급, 혼자 계신지 확인 필요.' },
      { date: '2024-07-17', emotion: 'caution', duration: '6분', summary: '우울감 표현, 일상에 대한 관심 저하.' },
      { date: '2024-07-16', emotion: 'normal', duration: '7분', summary: '활기찬 대화, 건강 상태 양호.' },
      { date: '2024-07-15', emotion: 'caution', duration: '5분', summary: '평온한 대화, 일상에 만족.' },
    ]
  },
  u2: { 
    name: '박철수', 
    age: 78, 
    emotion: 'caution', 
    phone: '010-2345-6789', 
    address: '서울시 서초구 서초동 456-78',
    desc: 'AI 감정분석: 주의 - 우울감과 불안감', 
    lastCall: '1시간 전',
    callDuration: '8분',
    callSummary: '우울감과 불안감이 있으나 상담으로 안정화',
    gender: '남성',
    medicalHistory: ['관절염'],
    emergencyContact: '010-8765-4321 (아들)',
    adminMemos: [
      { id: 1, author: '관리자A', date: '2024-07-18', content: '관절염으로 인한 통증이 있으시니 주의깊게 관찰 필요.' },
    ],
    emotionHistory: [
      { date: '2024-07-15', score: 3, callDuration: '6분' },
      { date: '2024-07-16', score: 2, callDuration: '8분' },
      { date: '2024-07-17', score: 2, callDuration: '7분' },
      { date: '2024-07-18', score: 2, callDuration: '8분' },
    ],
    conversationHistory: [
      { date: '2024-07-18', emotion: 'caution', duration: '8분', summary: '관절염 통증으로 인한 우울감 표현.' },
      { date: '2024-07-17', emotion: 'caution', duration: '7분', summary: '일상생활에 대한 걱정 표현.' },
      { date: '2024-07-16', emotion: 'caution', duration: '8분', summary: '건강 상태에 대한 우려.' },
      { date: '2024-07-15', emotion: 'normal', duration: '6분', summary: '평온한 대화, 건강 상태 양호.' },
    ]
  },
  u3: { 
    name: '이순자', 
    age: 85, 
    emotion: 'normal', 
    phone: '010-3456-7890', 
    address: '서울시 송파구 잠실동 789-12',
    desc: 'AI 감정분석: 정상 - 안정적인 상태', 
    lastCall: '2시간 전',
    callDuration: '5분',
    callSummary: '안정적인 상태로 일상생활 잘 하고 있음',
    gender: '여성',
    medicalHistory: [],
    emergencyContact: '010-7654-3210 (딸)',
    adminMemos: [],
    emotionHistory: [
      { date: '2024-07-15', score: 3, callDuration: '5분' },
      { date: '2024-07-16', score: 3, callDuration: '6분' },
      { date: '2024-07-17', score: 3, callDuration: '5분' },
      { date: '2024-07-18', score: 3, callDuration: '5분' },
    ],
    conversationHistory: [
      { date: '2024-07-18', emotion: 'normal', duration: '5분', summary: '활기찬 대화, 건강 상태 양호.' },
      { date: '2024-07-17', emotion: 'normal', duration: '5분', summary: '일상생활에 만족하고 있음.' },
      { date: '2024-07-16', emotion: 'normal', duration: '6분', summary: '가족과의 만남을 기대하고 있음.' },
      { date: '2024-07-15', emotion: 'normal', duration: '5분', summary: '평온한 대화, 건강 상태 양호.' },
    ]
  }
};
