let aiSocket = null;
let reconnectTimeout = null;
let isManualClose = false;

export const getAiSocket = () => aiSocket;

export const connectAiSocket = () => {
    return new Promise((resolve, reject) => {
        // 기존 소켓이 연결되어 있으면 재사용
        if (aiSocket && aiSocket.readyState === WebSocket.OPEN) {
            console.log('✅ 기존 AI WebSocket 연결 재사용');
            resolve(aiSocket);
            return;
        }

        // 기존 소켓이 연결 중이면 대기
        if (aiSocket && aiSocket.readyState === WebSocket.CONNECTING) {
            console.log('⏳ AI WebSocket 연결 대기 중...');
            const checkConnection = setInterval(() => {
                if (aiSocket.readyState === WebSocket.OPEN) {
                    clearInterval(checkConnection);
                    resolve(aiSocket);
                } else if (aiSocket.readyState === WebSocket.CLOSED) {
                    clearInterval(checkConnection);
                    reject(new Error('WebSocket 연결 실패'));
                }
            }, 100);
            return;
        }

        isManualClose = false;
        const WS_URL = import.meta.env.VITE_WS_URL || 'ws://202.31.135.25:8080/ws';
        aiSocket = new WebSocket(WS_URL);

        aiSocket.onopen = () => {
            console.log('✅ AI WebSocket 연결됨');
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = null;
            }
            resolve(aiSocket);
        };

        aiSocket.onerror = (err) => {
            console.error('❌ AI WebSocket 오류:', err);
            reject(err);
        };

        aiSocket.onclose = (event) => {
            console.log('🔴 AI WebSocket 닫힘', event.code, event.reason);

            // 수동으로 닫은 경우가 아니면 재연결 시도
            if (!isManualClose && !reconnectTimeout) {
                console.log('🔄 5초 후 재연결 시도...');
                reconnectTimeout = setTimeout(() => {
                    reconnectTimeout = null;
                    connectAiSocket().catch(err => {
                        console.error('재연결 실패:', err);
                    });
                }, 5000);
            }
        };
    });
};

export const closeAiSocket = () => {
    if (aiSocket) {
        isManualClose = true;
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        }
        aiSocket.close();
        aiSocket = null;
        console.log('🔴 AI WebSocket 수동 종료');
    }
};
