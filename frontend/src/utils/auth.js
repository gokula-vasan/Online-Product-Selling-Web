// Check if user is logged in
export const isAuthenticated = () => {
    return localStorage.getItem('userInfo') ? true : false;
};

// Get current user details
export const getUserDetails = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
};

// Logout user
export const logout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
};