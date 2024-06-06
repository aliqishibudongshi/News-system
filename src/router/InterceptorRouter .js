import React from 'react'
import { Navigate } from 'react-router-dom';


// 登录路由拦截
export default function LoginInterceptorRouter({ children }) {
    let isLogin = false;
    if (localStorage.getItem("token")) {
        isLogin = true;
    }
    return isLogin ? children : <Navigate to={"/login"} />
}