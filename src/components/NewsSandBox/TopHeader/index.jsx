import React, { useState } from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Layout, theme, Dropdown, Space, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
// 引入消息订阅-发布
import PubSub from "pubsub-js";
import "./index.css"

const { Header } = Layout;

export default function TopHeader() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // 订阅发布 - collapsed
    const handleCollapse = () => {
        setCollapsed(!collapsed);
        PubSub.publish("collapsed", collapsed);
    }
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"));
    const items = [
        {
            label: `${roleName}`,
            key: '1',
        },
        {
            label: '退出',
            danger: true,
            key: '2',
        },
    ];
    const onClick = ({ key }) => {
        if (key === "2") {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };
    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}
        >
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={handleCollapse}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <span>首页</span>
            <div className='top-header-welcome'>
                <span>欢迎<b className='welcome-user'>{username}</b>回来</span>
                <Dropdown
                    menu={{
                        items,
                        onClick,
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            {/* antd留的插槽 - 放头像组件 */}
                            <Avatar size="large" icon={<UserOutlined />} />
                        </Space>
                    </a>
                </Dropdown>
            </div>

        </Header>
    )
}
