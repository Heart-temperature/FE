import { extendTheme } from '@chakra-ui/react';

// ✅ 테마 커스터마이즈
const theme = extendTheme({
    fonts: {
        heading: `'Noto Sans KR', 'Pretendard', sans-serif`,
        body: `'Noto Sans KR', 'Pretendard', sans-serif`,
    },
    colors: {
        // 상태별 색상
        danger: '#D93025', // 긴급 - 진한 레드
        warning: '#F9AB00', // 주의 - 따뜻한 옐로
        safe: '#1B9A59', // 정상 - 신뢰감 있는 그린
        bg: '#F5F7FB', // 배경 - 밝은 회색

        // 추가 색상
        brand: {
            50: '#f0f9f0',
            100: '#dcf2dc',
            200: '#bce5bc',
            300: '#8dd18d',
            400: '#5bb85b',
            500: '#1B9A59',
            600: '#16804a',
            700: '#14663c',
            800: '#155332',
            900: '#14452c',
        },
        emergency: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#D93025',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
        },
        caution: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#F9AB00',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
        },
    },
    components: {
        Button: {
            variants: {
                emergency: {
                    bg: 'emergency.500',
                    color: 'white',
                    _hover: {
                        bg: 'emergency.600',
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg',
                    },
                },
                caution: {
                    bg: 'caution.500',
                    color: 'white',
                    _hover: {
                        bg: 'caution.600',
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg',
                    },
                },
                safe: {
                    bg: 'brand.500',
                    color: 'white',
                    _hover: {
                        bg: 'brand.600',
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg',
                    },
                },
            },
        },
        Card: {
            variants: {
                emergency: {
                    container: {
                        border: '2px solid',
                        borderColor: 'emergency.200',
                        boxShadow: '0 4px 20px rgba(217, 48, 37, 0.15)',
                        _hover: {
                            boxShadow: '0 8px 30px rgba(217, 48, 37, 0.25)',
                            transform: 'translateY(-2px)',
                        },
                    },
                },
                caution: {
                    container: {
                        border: '1px solid',
                        borderColor: 'caution.200',
                        boxShadow: '0 2px 10px rgba(249, 171, 0, 0.1)',
                        _hover: {
                            boxShadow: '0 4px 15px rgba(249, 171, 0, 0.2)',
                            transform: 'translateY(-1px)',
                        },
                    },
                },
                safe: {
                    container: {
                        border: '1px solid',
                        borderColor: 'brand.200',
                        boxShadow: '0 2px 10px rgba(27, 154, 89, 0.1)',
                        _hover: {
                            boxShadow: '0 4px 15px rgba(27, 154, 89, 0.2)',
                            transform: 'translateY(-1px)',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
