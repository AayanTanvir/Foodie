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

export const objArrayIncludes = (arr = [], obj = {}) => {
    /**returns if the given object is found inside the given array*/
    return arr.some(element => element?.id === obj?.id || element === obj);
}