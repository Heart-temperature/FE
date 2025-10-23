// 사용자 타입 정의
export const UserType = {
  id: 'string',
  name: 'string',
  age: 'number',
  emotion: 'string',
  phone: 'string',
  address: 'string',
  gender: 'string',
  lastCall: 'string',
  callDuration: 'string',
  callSummary: 'string',
  joinedDate: 'string',
  lastActive: 'string',
  desc: 'string'
};

// 폼 데이터 타입
export const UserFormType = {
  name: 'string',
  birthDate: 'string',
  gender: 'string',
  address: 'string',
  phone: 'string',
  emergencyContact: 'string',
  profileImage: 'File | null',
  notes: 'string'
};

// 캐릭터 타입
export const CharacterType = {
  id: 'string',
  name: 'string',
  emoji: 'string',
  color: 'string'
};

// 앱 상태 타입
export const AppStateType = 'intro' | 'home' | 'connecting' | 'calling' | 'ended';

// 정렬 타입
export const SortFieldType = 'name' | 'emotion' | 'gender' | 'joinedDate' | 'lastCall';
export const SortDirectionType = 'asc' | 'desc';

// 필터 타입
export const FilterType = {
  emotion: 'all' | 'urgent' | 'caution' | 'normal',
  search: 'string'
};
