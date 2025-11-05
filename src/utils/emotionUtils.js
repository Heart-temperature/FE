import { EMOTION_COLORS, EMOTION_TEXTS } from '../constants';

/**
 * 감정 상태에 따른 색상 반환
 * @param {string} emotion - 감정 상태
 * @returns {string} 색상 코드
 */
export const getEmotionColor = (emotion) => {
  return EMOTION_COLORS[emotion] || '#718096';
};

/**
 * 감정 상태에 따른 텍스트 반환
 * @param {string} emotion - 감정 상태
 * @returns {string} 표시 텍스트
 */
export const getEmotionText = (emotion) => {
  return EMOTION_TEXTS[emotion] || '알 수 없음';
};

/**
 * 감정 점수에 따른 색상 반환 (차트용)
 * @param {number} score - 감정 점수 (1: 긴급, 2: 주의, 3: 정상)
 * @returns {string} 색상 코드
 */
export const getEmotionScoreColor = (score) => {
  if (score === 1) return EMOTION_COLORS.urgent;
  if (score === 2) return EMOTION_COLORS.caution;
  if (score === 3) return EMOTION_COLORS.normal;
  return '#718096';
};

/**
 * 감정 점수에 따른 텍스트 반환 (차트용)
 * @param {number} score - 감정 점수
 * @returns {string} 표시 텍스트
 */
export const getEmotionScoreText = (score) => {
  if (score === 1) return '긴급';
  if (score === 2) return '주의';
  if (score === 3) return '정상';
  return '알 수 없음';
};

