import React from 'react'
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom'
import "./index.css"
import SideMenu from '../../components/NewsSandBox/SideMenu'
import TopHeader from '../../components/NewsSandBox/TopHeader'

const { Content } = Layout;

export default function NewsSandBox() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
            <SideMenu />
            <Layout>
                <TopHeader />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    )
}
