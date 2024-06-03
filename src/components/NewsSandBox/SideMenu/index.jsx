import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from "antd";
import {
    HomeOutlined,
    UserOutlined,
    SafetyOutlined,
    FolderOutlined,
    EditOutlined,
    EyeOutlined,
    ReadOutlined,
    VerticalAlignBottomOutlined,
    VerticalAlignTopOutlined,
    StopOutlined
} from '@ant-design/icons';
// 引入消息订阅-发布
import PubSub from "pubsub-js";
import axios from 'axios';
import "./index.css"

const { Sider } = Layout;

// SubMenu相关
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label
    };
}
// icon相关
const iconList = {
    "/home": <HomeOutlined />,
    '/user-manage': <FolderOutlined />,
    "/user-manage/list": <UserOutlined />,
    "/right-manage": <SafetyOutlined />,
    "/right-manage/role/list": <UserOutlined />,
    "/right-manage/right/list": <UserOutlined />,
    "/news-manage": <FolderOutlined />,
    "/news-manage/add": <EditOutlined />,
    "/news-manage/update/:id": <EditOutlined />,
    "/news-manage/preview/:id": <EyeOutlined />,
    "/news-manage/draft": <EditOutlined />,
    "/news-manage/category": <EditOutlined />,
    "/audit-manage": <FolderOutlined />,
    "/audit-manage/audit": <EyeOutlined />,
    "/audit-manage/list": <ReadOutlined />,
    "/publish-manage": <FolderOutlined />,
    "/publish-manage/unpublished": <VerticalAlignBottomOutlined />,
    "/publish-manage/published": <VerticalAlignTopOutlined />,
    "/publish-manage/sunset": <StopOutlined />
}

export default function SideMenu() {
    const navigate = useNavigate();

    // 获取pathname，截取pathname+拼接
    const { pathname } = useLocation();
    const selectedPathname = "/" + pathname.split('/')[1];

    const [collapsed, setCollapsed] = useState(false);

    const [menuList, setMenuList] = useState([]);

    const items = (menuList) => {
        let data = [];
        menuList.map(item => {
            const { label, key, children, pagepermission } = item;
            if (item.children && item.children.length !== 0) {
                return data.push(getItem(label, key, iconList[key], items(children)))
            }
            return pagepermission && data.push(getItem(label, key, iconList[key]))
        })
        return data;
    }

    useEffect(() => {
        // 控制折叠 - 使用订阅发布
        let token = PubSub.subscribe("collapsed", (_, data) => {
            setCollapsed(data);
        });
        // 取侧边栏数据
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            setMenuList(res.data);
        })
        return () => {
            // 控制折叠 - 取消订阅发布
            PubSub.unsubscribe(token);
        }
    }, [collapsed]);

    // 点击侧边导航，展示响应页面
    const onClick = (e) => {
        navigate(e.key);
    };
    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className='side-menu'>
                {collapsed ? "" : <div className="demo-logo-vertical">全球新闻管理系统</div>
                }
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[pathname]}
                    defaultOpenKeys={[selectedPathname]}
                    items={items(menuList)}
                    onClick={onClick}
                    className='side-menu-item'
                />
            </div>
        </Sider>
    )
}