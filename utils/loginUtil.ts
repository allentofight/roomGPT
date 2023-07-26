export const loginUtil = () => {
    const isLogin = () => {
        let sessionId = localStorage.getItem('sessionId')
        if (!sessionId) {
            return false
        }
        return true
    };
    return { isLogin };
}