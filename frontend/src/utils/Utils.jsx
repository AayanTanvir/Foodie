import axiosClient from "./axiosClient";

export const formatTime = (timeStr) => {
    if (!timeStr) return "Unknown";
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0);

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: 'numeric', hour12: true
    }).replace(" ", "");
}

export const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return "Unknown";
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "Unknown";
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
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

export const CapitalizeString = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
}

export const getOrderStatus = (status) => {
    if (!status) return "Unknown";
    switch (status) {
        case 'pending':
            return "Pending Approval";
        case 'preparing':
            return "Preparing";
        case 'ready_for_pickup':
            return "Ready for Pickup";
        case 'out_for_delivery':
            return "Out for Delivery";
        case 'delivered':
            return "Delivered";
        case 'cancelled':
            return "Cancelled";
        case 'declined':
            return "Declined";
        default:
            return "Unknown";
    }
}

export const getOrderPaymentMethod = (method) => {
    if (!method) return "Unknown";
    switch (method) {
        case 'card':
            return "Card";
        case 'cash_on_delivery':
            return "Cash on Delivery";
        default:
            return "Unknown: " + method;
    }
}

export const sendRequest = async ({ method="get", to, desiredStatus=200, postData={} }) => {
    switch (method) {
        case "get":
            try {
                const res = await axiosClient.get(to);

                if (res.status === desiredStatus) {
                    return res
                } else {
                    console.warn("Unknown response status: ", res.status);
                    return null
                }

            } catch (err) {
                console.error(err);
                return null
            }
        
        case "post":
            try {
                const res = await axiosClient.post(to, postData);

                if (res.status === desiredStatus) {
                    return res
                } else {
                    console.warn("Unknown response status: ", res.status);
                    return null
                }

            } catch (err) {
                console.error(err);
                return null
            }

        case "patch":
            try {
                const res = await axiosClient.patch(to, postData);

                if (res.status === desiredStatus) {
                    return true
                } else {
                    console.warn("Unknown response status: ", res.status);
                    return false
                }

            } catch (err) {
                console.error(err);
                return false
            }
        case "delete":
            try {
                const res = await axiosClient.delete(to);

                if (res.status === desiredStatus) {
                    return true
                } else {
                    console.warn("Unknown response status: ", res.status);
                    return false
                }

            } catch (err) {
                console.error(err);
                return false
            }
    }
}
