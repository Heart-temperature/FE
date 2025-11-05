/**
 * 전화번호 형식 검증
 * @param {string} phone - 전화번호
 * @returns {boolean} 유효한 형식인지 여부
 */
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
};

/**
 * 이메일 형식 검증
 * @param {string} email - 이메일
 * @returns {boolean} 유효한 형식인지 여부
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 사용자 폼 유효성 검사
 * @param {Object} formData - 폼 데이터
 * @returns {Object} 에러 객체
 */
export const validateUserForm = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = '성함을 입력해주세요';
  }

  if (!formData.birthDate) {
    errors.birthDate = '생년월일을 선택해주세요';
  } else {
    const age = calculateAge(formData.birthDate);
    if (age < 0) {
      errors.birthDate = '미래 날짜는 선택할 수 없습니다';
    }
  }

  if (!formData.gender) {
    errors.gender = '성별을 선택해주세요';
  }

  if (!formData.address?.trim()) {
    errors.address = '주소를 입력해주세요';
  }

  if (!formData.phone?.trim()) {
    errors.phone = '연락처를 입력해주세요';
  } else if (!isValidPhoneNumber(formData.phone)) {
    errors.phone = '올바른 연락처 형식이 아닙니다 (010-0000-0000)';
  }

  if (formData.emergencyContact && !isValidPhoneNumber(formData.emergencyContact)) {
    errors.emergencyContact = '올바른 연락처 형식이 아닙니다 (010-0000-0000)';
  }

  return errors;
};

// calculateAge import (순환 참조 방지를 위해 여기서 직접 정의)
const calculateAge = (birthDate) => {
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

