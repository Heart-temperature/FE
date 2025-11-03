// src/theme.js
import { extendTheme } from '@chakra-ui/react';

// '숲속의 온기' 테마 색상 정의
const colors = {
    // 1. 색상 팔레트 정의
    forest: {
        // #3A5A40 (짙은 숲색 - 주조색)
        500: '#3A5A40',
        600: '#3A5A40', // 기본값으로 사용
        700: '#2F4833', // 호버(hover) 시 약간 더 어둡게
    },
    warmAccent: {
        // #D97706 (따뜻한 앰버 - 보조색/강조색)
        500: '#D97706',
        600: '#D97706', // 기본값
        700: '#B86605', // 호버 시
    },
    warmBg: '#FBF8F3', // #FBF8F3 (웜 베이지 - 배경색)
    warmText: '#3E3A39', // #3E3A39 (진한 고동색 - 기본 텍스트)

    // 2. 비활성화 버튼 색상 정의 (이전 질문 기반)
    disabledBg: '#D8D8D8',
    disabledText: '#A9A9A9',
};

// 3. 테마 확장
const theme = extendTheme({
    colors: {
        ...colors,
        // Chakra UI의 기본 'green'과 'orange'를 덮어쓰거나
        // 'brand'같은 시맨틱 토큰을 만들 수 있습니다.
        // 여기서는 'green'과 'orange'를 직접 지정해봅시다.
        green: colors.forest,
        orange: colors.warmAccent,
    },

    // 4. 전역 스타일 설정 (기본 배경 및 텍스트 색상)
    styles: {
        global: {
            body: {
                bg: 'warmBg',
                color: 'warmText',
            },
        },
    },

    // 5. 컴포넌트별 기본 스타일 설정
    components: {
        Button: {
            // 기본 variant인 'solid' 스타일을 덮어씁니다.
            variants: {
                solid: (props) => {
                    // colorScheme이 'green'일 때 (기본값)
                    if (props.colorScheme === 'green') {
                        return {
                            bg: 'green.600',
                            color: 'white',
                            _hover: {
                                bg: 'green.700',
                            },
                            _disabled: {
                                // 비활성화 스타일
                                bg: 'disabledBg',
                                color: 'disabledText',
                                _hover: { bg: 'disabledBg' }, // 호버 시에도 변경 없음
                            },
                        };
                    }
                    // colorScheme이 'orange'일 때 (강조 버튼용)
                    if (props.colorScheme === 'orange') {
                        return {
                            bg: 'orange.600',
                            color: 'white',
                            _hover: {
                                bg: 'orange.700',
                            },
                        };
                    }
                    // 기본 Chakra solid 스타일 (다른 colorScheme)
                    return {};
                },
            },
            // 앱의 모든 버튼에 대한 기본 colorScheme을 'green'으로 설정
            defaultProps: {
                colorScheme: 'green',
            },
        },
    },

    // (선택사항) 노년층 가독성을 위한 폰트 설정
    fonts: {
        heading:
            "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
        body: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    },
});

export default theme;
