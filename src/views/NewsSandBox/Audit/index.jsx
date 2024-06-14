import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Tooltip, notification } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Audit() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    const { roleId, username, region } = JSON.parse(localStorage.getItem('token'));
    useEffect(() => {
        setLoading(true);
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        axios.get(`/news?auditState=1&_expand=category`).then(res => {
            setDataSource(roleObj[roleId] === 'superadmin' ? res.data : [
                ...res.data.filter(item => item.author === username),
                ...res.data.filter(item => item.region === region && roleObj[item.roleId] === "editor")
            ]);
            setLoading(false);
        })
    }, [region, roleId, username]);

    // Table组件相关
    const columns = [
        {
            title: "新闻标题",
            dataIndex: "label",
            render: (label, item) => {
                return <Link to={`/news-manage/preview/${item.id}`}>{label}</Link>
            }
        },
        {
            title: "作者",
            dataIndex: "author"
        },
        {
            title: "新闻分类",
            dataIndex: "category",
            render: (category) => {
                return category.label
            }
        },
        {
            title: "操作",
            render: (item) => {
                return (
                    <div className='operate-button'>
                        <Tooltip title='不通过'>
                            <Button danger type="primary" shape="circle" icon={<CloseOutlined />} onClick={() => handleAuditNews(item.id, 3, 0)} disabled={item.default}></Button>
                        </Tooltip>
                        <Tooltip title='通过'>
                            <Button type="primary" shape="circle" icon={<CheckOutlined />} disabled={item.default} onClick={() => handleAuditNews(item.id, 2, 1)}></Button>
                        </Tooltip>
                    </div >
                )
            }
        },
    ];

    // passing & fail button
    const handleAuditNews = (id, auditState, publishState) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/news/${id}`, {
            auditState,
            publishState
        }).then(()=>{
            notification.info({
                message: `通知`,
                description:
                    `您可以到到【审核管理/审核列表】中查看您的新闻的审核状态`,
                placement: "bottomRight",
            });
        })
    }

    return (
        <div>
            {/* Table相关 */}
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} loading={loading} rowKey={item => item.id}></Table>
        </div>
    )
}
