import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

/**
 * VideoCharacter 컴포넌트
 * AI 음성과 동기화되는 MP4 영상 재생 컴포넌트
 *
 * @param {string} videoSrc - MP4 영상 파일 경로
 * @param {boolean} speaking - AI가 말하고 있는지 여부
 * @param {boolean} loop - 영상을 반복 재생할지 여부 (기본값: true)
 * @param {boolean} muted - 영상 음소거 여부 (기본값: true)
 * @param {string} width - 영상 너비 (기본값: '400px')
 * @param {string} height - 영상 높이 (기본값: '400px')
 */
export const VideoCharacter = ({
  videoSrc,
  speaking = false,
  loop = true,
  muted = true,
  width = '400px',
  height = '400px',
  ...props
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (speaking) {
      // AI가 말하기 시작하면 영상 재생
      video.play().catch(error => {
        console.error('Video playback failed:', error);
      });
    } else {
      // AI가 말을 멈추면 영상 정지
      video.pause();
      // 영상을 처음으로 되돌림 (선택사항)
      video.currentTime = 0;
    }
  }, [speaking]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        loop={loop}
        muted={muted}
        playsInline
        style={{
          width,
          height,
          objectFit: 'contain',
          borderRadius: '12px'
        }}
      >
        <track kind="captions" />
        브라우저가 비디오를 지원하지 않습니다.
      </video>
    </Box>
  );
};
