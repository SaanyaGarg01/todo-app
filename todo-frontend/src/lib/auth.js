export const login = async (username, password) => {
    const { data } = await axios.post("/api/auth/login", { username, password });
    localStorage.setItem("token", data.token);
  };
  
  export const signup = async (username, password) => {
    await axios.post("/api/auth/signup", { username, password });
  };
  
  export const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  