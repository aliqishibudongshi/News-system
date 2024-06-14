import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Modal, notification, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import "./index.css"

const { confirm } = Modal;

export default function NewsDraft() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const { username } = JSON.parse(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            setDataSource(res.data);
        })
    }, [username]);


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            render: (id) => {
                return <b>{id}</b>
            }
        },
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
                        <Tooltip title='删除'>
                            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => handleConfirm(item)}></Button>
                        </Tooltip>
                        <Tooltip title='编辑'>
                            <Button shape="circle" icon={<EditOutlined />} onClick={() => { navigate(`/news-manage/update/${item.id}`) }}></Button>
                        </Tooltip>
                        <Tooltip title='提交审核'>
                            <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={() => handleSubmitReview(item.id)}></Button>
                        </Tooltip>
                    </div >
                )
            }
        }
    ];
    // 提交审核按钮相关
    const handleSubmitReview = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(() => {
            navigate('/audit-manage/list');
            notification.info({
                message: `通知`,
                description:
                    `您可以到审核列表中查看您的新闻`,
                placement: "bottomRight",
            })
        })
    }

    // 操作中删除提示相关
    const handleConfirm = (item) => {
        confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                handleOkDelete(item);
            },
            onCancel() { },
        });
    };

    // 确认删除，当前展示页面 + 后端数据
    const handleOkDelete = (item) => {
        setLoading(true);
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/news/${item.id}`);
        setLoading(false);
    }

    return (
        <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={false} loading={loading}></Table>
    )
}