export const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0);

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: 'numeric', hour12: true
    }).replace(" ", "");
}

export const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
}

export const objArrayIncludes = (arr = [], obj = {}) => {
    /**returns if the given object is found inside the given array*/
    return arr.some(element => element?.id === obj?.id || element === obj);
}

export const isExpiredSeconds = (exp) => {
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
} 