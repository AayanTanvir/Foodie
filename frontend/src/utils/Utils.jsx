export const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0);

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: 'numeric', hour12: true
    }).replace(" ", "");
}

export const logout = () => {
    localStorage.removeItem("authTokens");
    window.location.href = '/login';
}