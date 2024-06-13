import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom';

import Login from '../views/Login'
import NewsSandBox from '../views/NewsSandBox';
import LoginInterceptorRouter from './InterceptorRouter ';
import Home from '../views/NewsSandBox/Home';
import UserList from '../views/NewsSandBox/UserList';
import RoleList from '../views/NewsSandBox/RoleList';
import RightList from '../views/NewsSandBox/RightList';
import NewsAdd from '../views/NewsSandBox/NewsAdd';
import NewsDraft from '../views/NewsSandBox/NewsDraft';
import NewsCategory from '../views/NewsSandBox/NewsCategory';
import Audit from '../views/NewsSandBox/Audit';
import AuditList from '../views/NewsSandBox/AuditList';
import Unpublished from '../views/NewsSandBox/Unpublished';
import Published from '../views/NewsSandBox/Published';
import Sunset from '../views/NewsSandBox/Sunset';
import NoPermission from '../views/NewsSandBox/NoPermission';
import NewsPreview from '../views/NewsSandBox/NewsPreview';
import NewsUpdate from '../views/NewsSandBox/NewsUpdate';


export default function IndexRouter() {
    const element = useRoutes([
        {
            path: "/",
            element: <LoginInterceptorRouter ><NewsSandBox /></LoginInterceptorRouter >,
            children: [
                {
                    path: "",
                    element: <Navigate to={"/home"} />
                },
                {
                    path: "home",
                    element: <Home />
                },
                {
                    path: "user-manage/list",
                    element: <UserList />
                },
                {
                    path: "right-manage/role/list",
                    element: <RoleList />
                },
                {
                    path: "right-manage/right/list",
                    element: <RightList />
                },
                {
                    path: "news-manage/add",
                    element: <NewsAdd />
                },
                {
                    path: "news-manage/draft",
                    element: <NewsDraft />
                },
                {
                    path: "news-manage/category",
                    element: <NewsCategory />,
                },
                {
                    path: "news-manage/preview/:id",
                    element: <NewsPreview />,
                },
                {
                    path: "news-manage/update/:id",
                    element: <NewsUpdate />,
                },
                {
                    path: "audit-manage/audit",
                    element: <Audit />
                },
                {
                    path: "audit-manage/list",
                    element: <AuditList />
                },
                {
                    path: "publish-manage/unpublished",
                    element: <Unpublished />
                },
                {
                    path: "publish-manage/published",
                    element: < Published />
                },
                {
                    path: "publish-manage/sunset",
                    element: <Sunset />
                },
                {
                    path: "*",
                    element: <NoPermission />
                },
            ]
        },
        {
            path: "/login",
            element: <Login />
        },
    ])
    return (
        element
    )
}