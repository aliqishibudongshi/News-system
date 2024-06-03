import React, { useState, useEffect } from 'react'
import { Table, Button, Tag, Modal, Popover, Switch } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";
import "./index.css"

const { confirm } = Modal;
export default function RightList() {
    const [dataSource, setDataSource] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:5000/rights?_embed=children").then(res => {
            // 首页无children为了不显示+，设置成空字符串
            let list = res.data;
            list.forEach(item => {
                if (item.children.length === 0) {
                    list[0].children = "";
                }
            })
            setDataSource(list);
            setLoading(false);
        })
    }, []);

    // Table组件相关
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            render: (id) => {
                return (
                    <b>{id}</b>
                )
            }
        },
        {
            title: "权限名称",
            dataIndex: "label"
        },
        {
            title: "权限路径",
            dataIndex: "key",
            render: (key) => {
                return (
                    <Tag color='orange'>{key}</Tag>
                )
            }
        },
        {
            title: "操作",
            render: (item) => {
                return (
                    <div className='operate-button'>
                        <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => handleConfirm(item)}></Button>
                        <Popover content={
                            <Switch checked={item.pagepermission} onChange={() => handleSwitch(item)} />
                        } title="页面配置项" trigger={item.pagepermission === undefined ? "" : "click"}>
                            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermission === undefined}></Button>
                        </Popover>
                    </div >
                )
            }
        },
    ];

    // 页面配置项
    const handleSwitch = (item) => {
        item.pagepermission = item.pagepermission === 1 ? 0 : 1;
        setDataSource([...dataSource]);
        if (item.grade === 1) {
            axios.patch(`http://localhost:5000/rights/${item.id}`, { pagepermission: item.pagepermission });
        } else {
            axios.patch(`http://localhost:5000/children/${item.id}`, { pagepermission: item.pagepermission });
        }
    }

    // 操作中删除提示相关
    const handleConfirm = (item) => {
        confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleFilled />,
            onOk() {
                handleOkDelete(item);
            },
            onCancel() {},
        });
    };

    // 确认删除，当前展示页面 + 后端数据
    const handleOkDelete = (item) => {
        setLoading(true);
        // 一级数据删除相关
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id));
            axios.delete(`http://localhost:5000/rights/${item.id}`);

        } else {
            // 二级的rightId去找一级的id，相同的取出（子找父）
            let list = dataSource.filter(data => data.id === item.rightId);
            // 一级菜单，过滤出不相同id的数据（父找子）
            list[0].children = list[0].children.filter(data => data.id !== item.id);
            // 二级不影响dataSource需要展开
            setDataSource([...dataSource]);
            axios.delete(`http://localhost:5000/children/${item.id}`);
        }
        setLoading(false);
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} loading={loading}></Table>
        </div>
    )
}
