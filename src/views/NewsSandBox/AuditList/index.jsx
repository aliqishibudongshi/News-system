import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button, Table, Tag, notification } from 'antd';
import axios from 'axios';

export default function AuditList() {
    const [dataSource, setDataSource] = useState([]);
    const navigate = useNavigate();
    // 取本地数据
    const { username } = JSON.parse(localStorage.getItem('token'));
    // 取表数据
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            setDataSource(res.data);
        })
    }, [username]);


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
            title: "审核状态",
            dataIndex: "auditState",
            render: (auditState) => {
                const colorList = ['default', 'warning', 'success', 'error'];
                const auditList = ['', '审核中', '已通过', '未通过'];

                return <Tag color={`${colorList[auditState]}`}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return (
                    <div className='operate-button'>
                        {
                            item.auditState === 1 && <Button danger onClick={() => handleRevert(item.id)}>撤销</Button>
                        }
                        {
                            item.auditState === 2 && <Button type="primary" onClick={() => handlePublish(item.id)}>发布</Button>
                        }
                        {
                            item.auditState === 3 && <Button onClick={() => handleUpdate(item.id)}>修改</Button>
                        }
                    </div >
                )
            }
        }
    ];

    // 撤销按钮
    const handleRevert = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 0
        }).then(() => {
            setDataSource(dataSource.filter(item => item.id !== id));
            notification.info({
                message: `通知`,
                description:
                    `您可以到草稿箱中查看您的新闻`,
                placement: "bottomRight",
            });
        })
    }
    // 发布按钮
    const handlePublish = (id) => {
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now(),
        }).then(() => {
            navigate(`/publish-manage/published`);
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已发布】中查看您的新闻`,
                placement: "bottomRight",
            });
        })
    }
    // 修改按钮
    const handleUpdate = (id) => {
        navigate(`/news-manage/update/${id}`);
    }

    return (
        <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }}></Table>
    )
}
