/**
 * 오디오 재생 관련 유틸리티
 */

// 현재 재생 중인 오디오들을 추적
let activeAudios = new Set();

/**
 * 모든 오디오 재생 중지
 */
export const stopAllAudios = () => {
    console.log('🛑 모든 오디오 재생 중지 요청');
    activeAudios.forEach((audio) => {
        try {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
        } catch (error) {
            console.warn('오디오 중지 중 오류:', error);
        }
    });
    activeAudios.clear();
    console.log('✅ 모든 오디오 재생 중지 완료');
};

/**
 * TTS 오디오 재생
 * @param {Blob} audioBlob - 재생할 오디오 Blob
 * @param {Object} callbacks - 콜백 함수들
 * @param {Function} callbacks.onStart - 재생 시작 시 호출
 * @param {Function} callbacks.onEnd - 재생 종료 시 호출
 * @param {Function} callbacks.onError - 재생 오류 시 호출
 * @param {boolean} callbacks.isEndCallAudio - 통화 종료 오디오인지 여부 (true면 이전 오디오 중지)
 * @returns {Promise<Audio>} Audio 객체
 */
export const playTtsAudio = async (audioBlob, callbacks = {}) => {
    try {
        if (!audioBlob || audioBlob.size < 100) {
            console.log('⚠️ 오디오 크기가 너무 작음');
            if (callbacks.onError) {
                callbacks.onError(new Error('오디오 데이터가 너무 작습니다'));
            }
            return null;
        }

        // 통화 종료 오디오인 경우 이전 오디오 모두 중지
        if (callbacks.isEndCallAudio) {
            console.log('📞 통화 종료 오디오 - 이전 오디오 모두 중지');
            stopAllAudios();
        } else {
            // 통화 종료 오디오가 아닌 경우, 재생 중인 오디오가 있으면 새로운 오디오 재생하지 않음
            if (activeAudios.size > 0) {
                console.log('⚠️ 재생 중인 TTS가 있어서 새로운 TTS 재생 취소');
                // Blob URL 정리
                const audioUrl = URL.createObjectURL(audioBlob);
                URL.revokeObjectURL(audioUrl);
                return null;
            }
        }

        console.log('='.repeat(50));
        console.log('📥 AI 오디오 Blob 수신');
        console.log('   크기:', audioBlob.size, 'bytes');
        
        // AI 오디오 수신 시 "응답 생성 중" 프로그레스 바 숨김
        if (callbacks.onAudioReceived) {
            callbacks.onAudioReceived();
        }

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // 재생 중인 오디오 목록에 추가
        activeAudios.add(audio);

        console.log('🔊 AI 말하기 시작');

        // 재생 종료 처리
        audio.onended = () => {
            activeAudios.delete(audio);
            if (callbacks.onEnd) {
                callbacks.onEnd();
            }
            URL.revokeObjectURL(audioUrl);
            console.log('✅ AI 말하기 종료');
            console.log('='.repeat(50));
        };

        // 재생 오류 처리
        audio.onerror = (error) => {
            activeAudios.delete(audio);
            console.error('❌ 오디오 재생 실패:', error);
            if (callbacks.onError) {
                callbacks.onError(error);
            }
            URL.revokeObjectURL(audioUrl);
        };

        // 실제 재생 시작 시 콜백 호출 (playing 이벤트 사용)
        audio.onplaying = () => {
            // 오디오가 실제로 재생되기 시작할 때 콜백 호출
            if (callbacks.onStart) {
                callbacks.onStart();
            }
            console.log('✅ 오디오 실제 재생 시작');
        };

        // 오디오 재생
        await audio.play();
        console.log('✅ audio.play() 호출 완료 (실제 재생 시작 대기 중)');

        return audio;
    } catch (error) {
        console.error('❌ audio.play() 실패:', error);
        if (callbacks.onError) {
            callbacks.onError(error);
        }
        return null;
    }
};

