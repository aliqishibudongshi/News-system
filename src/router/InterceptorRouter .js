import React from 'react'
import { Navigate } from 'react-router-dom'

// 路有拦截
export default function InterceptorRouter ({children}) {
    let isLogin = false;
    if(localStorage.getItem("token")){
        isLogin = true;
    }
    return isLogin ? children : <Navigate to={"/login"}/>
}