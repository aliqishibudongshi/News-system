import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import Login from '../views/Login'
import NewsSandBox from '../views/NewsSandBox';
import InterceptorRouter  from './InterceptorRouter ';
import Home from '../views/NewsSandBox/Home';
import UserList from '../views/NewsSandBox/UserList';
import RoleList from '../views/NewsSandBox/RoleList';
import RightList from '../views/NewsSandBox/RightList';
import NoPermission from '../views/NewsSandBox/NoPermission';

export default function IndexRouter() {
    const element = useRoutes([
        {
            path: "/",
            element: <InterceptorRouter ><NewsSandBox/></InterceptorRouter >,
            children: [
                {
                    path: "",
                    element: <Navigate to={"/home"}/>
                },
                {
                    path: "home",
                    element: <Home/>
                },
                {
                    path: "user-manage/list",
                    element: <UserList/>
                },
                {
                    path: "right-manage/role/list",
                    element: <RoleList/>
                },
                {
                    path: "right-manage/right/list",
                    element: <RightList/>
                },
                {
                    path: "*",
                    element: <NoPermission/>
                },
            ]
        },
        {
            path: "/login",
            element: <Login/>
        },
    ])
    return (
        element
    )
}