// utils/auth.js
export const getUserFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
  
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };
  
  export const getUserRole = () => {
    return getUserFromToken()?.role || null;
  };
  
  export const getUserId = () => {
    return getUserFromToken()?.uid || null;
  };