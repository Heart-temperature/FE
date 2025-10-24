import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// 입모양의 공통 스타일 (위치, 색상)
const baseMouthStyle = {
    position: 'absolute',
    bottom: '28%',
    left: 'calc(50% - 14px)',
    transform: 'translateX(-50%)',
    bg: '#66E3FF',
};

// 각 Viseme에 대한 입모양 정의
const visemeShapes = {
    // 'i', 'E': '이', '에', '애', '어' (벌린 입)
    a: {
        w: '30px',
        h: '24px',
        borderRadius: '10px 10px 14px 14px',
        bottom: '24%',
        animate: {
            scaleY: [0.9, 1.1, 0.95, 1.05, 0.9],
            scaleX: [0.95, 1.05, 1, 0.95, 1],
        },
        transition: { duration: 0.3, repeat: Infinity, ease: 'easeInOut' },
    },
    // 'u', 'o': '우', '오' (둥근 입)
    u: {
        w: '18px',
        h: '18px',
        left: 'calc(50% - 9px)',
        borderRadius: 'full',
        animate: {
            scale: [0.8, 1.2, 0.9, 1.1, 0.85],
        },
        transition: { duration: 0.8, repeat: Infinity, ease: 'circOut' },
    },
    // 'i': '이', '으' (가로로 찢어진 입)
    i: {
        w: '36px',
        h: '8px',
        left: 'calc(50% - 19px)',
        borderRadius: '8px',
        animate: {
            scaleY: [0.7, 1.1, 0.8, 1.2, 0.7],
            scaleX: [0.95, 1.05, 1, 0.95, 1],
        },
        transition: { duration: 0.4, repeat: Infinity, ease: 'linear' },
    },
    // 'neutral' (자음: p, t, k, s 등) - 기본 입모양
    neutral: {
        w: '28px',
        h: '6px',
        borderRadius: '6px',
        animate: {
            scaleY: [0.9, 1.1, 0.9],
        },
        transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' },
    },
};

/**
 * Viseme에 따라 다른 입모양을 렌더링하는 컴포넌트
 * @param {Object} props
 * @param {string} props.viseme - 'a', 'u', 'i', 'neutral' 등
 */
export const Mouth = ({ viseme }) => {
    let shape;

    // Polly Viseme 코드를 우리가 정의한 3가지 대표 모양으로 매핑
    switch (viseme) {
        case 'a': // '아', '야'
        case 'E': // '어', '여', '에', '애' 등
            shape = visemeShapes.a;
            break;

        case 'u': // '우', '유', '으'
        case 'o': // '오', '요'
        case 'w': // '와', '워' 등 W 계열
            shape = visemeShapes.u;
            break;

        case 'i': // '이'
            shape = visemeShapes.i;
            break;

        // 'p', 't', 'k', 's' 등 모든 자음 및 매핑 안 된 모음
        default:
            shape = visemeShapes.neutral;
    }

    return <MotionBox {...baseMouthStyle} {...shape} />;
};
