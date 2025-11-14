let aiSocket = null;

export const getAiSocket = () => aiSocket;

export const connectAiSocket = () => {
    return new Promise((resolve, reject) => {
        aiSocket = new WebSocket(`ws://202.31.135.25:8080/ws`);

        aiSocket.onopen = () => {
            console.log('AI WebSocket 연결됨');
            resolve(aiSocket);
        };

        aiSocket.onerror = (err) => {
            console.error('AI WebSocket 오류:', err);
            reject(err);
        };

        aiSocket.onclose = () => {
            console.log('AI WebSocket 닫힘');
        };
    });
};
