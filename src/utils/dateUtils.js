/**
 * 생년월일로부터 나이 계산
 * @param {string} birthDate - 생년월일 (YYYY-MM-DD)
 * @returns {number} 나이
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * 현재 시간을 한국어 형식으로 포맷
 * @returns {string} 포맷된 시간 문자열
 */
export const getCurrentTimeString = () => {
  const now = new Date();
  return now.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * 현재 날짜를 한국어 형식으로 포맷
 * @returns {string} 포맷된 날짜 문자열
 */
export const getCurrentDateString = () => {
  const now = new Date();
  return now.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
};

/**
 * 날짜를 MM/DD 형식으로 변환 (차트용)
 * @param {string} dateString - 날짜 문자열 (YYYY-MM-DD)
 * @returns {string} MM/DD 형식
 */
export const formatDateForChart = (dateString) => {
  if (!dateString) return '';
  return dateString.split('-').slice(1).join('/');
};

