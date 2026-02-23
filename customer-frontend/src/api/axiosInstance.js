import axios from "axios";

const instance  = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.response.use(
    (response)=>response,
    (error) => {
        if(error.response && error.response.status== 401)
        {
            localStorage.clear();
            window.location.href= "/login";
        }

        return Promise.reject(error);
    }
);

export default instance;