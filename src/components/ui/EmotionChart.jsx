import { useState } from 'react';
import { Box, VStack, Heading } from '@chakra-ui/react';

// 점수에 따른 색상 반환 (긴급, 주의, 정상 3단계)
const getScoreColor = (score) => {
  if (score >= 80) return '#EF4444'; // 빨강 - 긴급
  if (score >= 40) return '#FB923C'; // 오렌지 - 주의
  return '#22C55E'; // 초록 - 정상
};

/**
 * 감정 변화 그래프 컴포넌트
 * @param {Object} props
 * @param {Array} props.data - 그래프 데이터 배열
 * @param {string} props.title - 그래프 제목 (기본값: "우울 점수 변화")
 * @param {number} props.width - 그래프 너비 (기본값: 800)
 * @param {number} props.height - 그래프 높이 (기본값: 400)
 * 
 * data 형식:
 * - { date: string, score: number, time?: string } 또는
 * - { date: string, score: number, count?: number }
 */
export const EmotionChart = ({ 
  data = [], 
  title = "우울 점수 변화",
  width = 800,
  height = 400 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // 데이터가 없으면 빈 화면 표시
  if (!data || data.length === 0) {
    return (
      <Box w="100%" p={6} bg="white" borderRadius="lg" boxShadow="sm">
        <VStack spacing={4} align="stretch">
          <Heading size="md" textAlign="center" color="gray.700">
            {title}
          </Heading>
          <Box h={height} display="flex" alignItems="center" justifyContent="center">
            <Box color="gray.500" fontSize="lg">기록 없음</Box>
          </Box>
        </VStack>
      </Box>
    );
  }

  // 데이터 정규화 (다양한 형식 지원)
  const normalizedData = data.map((item, index) => {
    // date가 Date 객체인 경우 문자열로 변환
    let dateStr = item.date;
    if (dateStr instanceof Date) {
      dateStr = dateStr.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    } else if (typeof dateStr === 'string' && dateStr.includes('-')) {
      // YYYY-MM-DD 형식을 M월 D일 형식으로 변환
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        dateStr = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
      }
    }

    // time이 없으면 빈 문자열 또는 기본값
    let timeStr = item.time || '';
    if (!timeStr && item.date) {
      // date에서 시간 정보 추출 시도
      const dateObj = new Date(item.date);
      if (!isNaN(dateObj.getTime())) {
        timeStr = dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
    }

    return {
      date: dateStr,
      time: timeStr,
      score: typeof item.score === 'number' ? item.score : 0,
      count: item.count || index + 1,
    };
  });

  const padding = { top: 40, right: 120, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxScore = 100;
  
  // 좌표 계산
  const getX = (index) => {
    if (normalizedData.length === 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (normalizedData.length - 1)) * chartWidth;
  };
  const getY = (score) => padding.top + chartHeight - (score / maxScore) * chartHeight;
  
  // 라인 경로 생성
  const linePath = normalizedData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.score)}`
  ).join(' ');
  
  // 긴급 구간 영역 (80 이상)
  const urgentZonePath = `M ${padding.left} ${getY(80)} L ${padding.left + chartWidth} ${getY(80)} L ${padding.left + chartWidth} ${padding.top} L ${padding.left} ${padding.top} Z`;
  
  // 주의 구간 영역 (40-80)
  const cautionZonePath = `M ${padding.left} ${getY(40)} L ${padding.left + chartWidth} ${getY(40)} L ${padding.left + chartWidth} ${getY(80)} L ${padding.left} ${getY(80)} Z`;
  
  return (
    <Box w="100%" p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        <Heading size="md" textAlign="center" color="gray.700">
          {title}
        </Heading>
        
        <Box position="relative" w="100%" overflow="visible">
          <svg width={width} height={height} style={{ overflow: 'visible' }}>
            {/* 그라데이션 정의 */}
            <defs>
              <linearGradient id="urgentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEE2E2" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FEE2E2" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="cautionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#FED7AA" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* 긴급 구간 그라데이션 */}
            <path d={urgentZonePath} fill="url(#urgentGradient)" />
            
            {/* 주의 구간 그라데이션 */}
            <path d={cautionZonePath} fill="url(#cautionGradient)" />
            
            {/* 세로 가이드라인 */}
            <line 
              x1={padding.left} 
              y1={getY(80)} 
              x2={padding.left + chartWidth} 
              y2={getY(80)} 
              stroke="#FCA5A5" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
              opacity="0.5"
            />
            <line 
              x1={padding.left} 
              y1={getY(40)} 
              x2={padding.left + chartWidth} 
              y2={getY(40)} 
              stroke="#FCD34D" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
              opacity="0.5"
            />
            
            {/* Y축 레이블 */}
            <text x={padding.left - 10} y={getY(100) + 5} textAnchor="end" fontSize="12" fill="#6B7280">100</text>
            <text x={padding.left - 10} y={getY(80) + 5} textAnchor="end" fontSize="12" fill="#6B7280">80</text>
            <text x={padding.left - 10} y={getY(40) + 5} textAnchor="end" fontSize="12" fill="#6B7280">40</text>
            <text x={padding.left - 10} y={getY(0) + 5} textAnchor="end" fontSize="12" fill="#6B7280">0</text>
            
            {/* 구간 레이블 - 그래프 오른쪽 외부 */}
            <text x={padding.left + chartWidth + 15} y={getY(90)} textAnchor="start" fontSize="11" fill="#DC2626" fontWeight="500">긴급</text>
            <text x={padding.left + chartWidth + 15} y={getY(60)} textAnchor="start" fontSize="11" fill="#EA580C" fontWeight="500">주의</text>
            <text x={padding.left + chartWidth + 15} y={getY(20)} textAnchor="start" fontSize="11" fill="#16A34A" fontWeight="500">정상</text>
            
            {/* 메인 라인 */}
            {normalizedData.length > 1 && (
              <path 
                d={linePath} 
                fill="none" 
                stroke="#6366F1" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            )}
            
            {/* 데이터 포인트 */}
            {normalizedData.map((d, i) => (
              <g key={i}>
                <circle 
                  cx={getX(i)} 
                  cy={getY(d.score)} 
                  r="5" 
                  fill={getScoreColor(d.score)}
                  stroke="white"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            ))}
            
            {/* X축 레이블 (5일 간격 또는 데이터가 적으면 모두 표시) */}
            {normalizedData.map((d, i) => {
              const interval = normalizedData.length <= 10 ? 1 : 5;
              if (i % interval === 0 || i === normalizedData.length - 1) {
                return (
                  <g key={i}>
                    <line 
                      x1={getX(i)} 
                      y1={padding.top + chartHeight} 
                      x2={getX(i)} 
                      y2={padding.top + chartHeight + 5} 
                      stroke="#9CA3AF" 
                      strokeWidth="1"
                    />
                    <text 
                      x={getX(i)} 
                      y={padding.top + chartHeight + 20} 
                      textAnchor="middle" 
                      fontSize="10" 
                      fill="#6B7280"
                    >
                      {d.date}
                    </text>
                  </g>
                );
              }
              return null;
            })}
            
            {/* 툴팁 - 가장 마지막에 렌더링하여 최상단에 표시 */}
            {hoveredIndex !== null && (() => {
              const d = normalizedData[hoveredIndex];
              const tooltipWidth = 80;
              const tooltipHeight = d.time ? 40 : 20;
              return (
                <g>
                  {/* 툴팁 배경 */}
                  <rect
                    x={getX(hoveredIndex) - tooltipWidth / 2}
                    y={getY(d.score) - tooltipHeight - 10}
                    width={tooltipWidth}
                    height={tooltipHeight}
                    rx="4"
                    fill="rgba(0, 0, 0, 0.8)"
                  />
                  {/* 툴팁 텍스트 - 날짜와 시간 줄바꿈 */}
                  <text
                    x={getX(hoveredIndex)}
                    y={getY(d.score) - tooltipHeight + 5}
                    textAnchor="middle"
                    fontSize="11"
                    fill="white"
                    fontWeight="500"
                  >
                    <tspan x={getX(hoveredIndex)} dy="0">{d.date}</tspan>
                    {d.time && <tspan x={getX(hoveredIndex)} dy="16">{d.time}</tspan>}
                  </text>
                </g>
              );
            })()}
          </svg>
        </Box>
      </VStack>
    </Box>
  );
};

