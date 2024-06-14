import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree, Tooltip } from "antd";
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";
import "./index.css"

const { confirm } = Modal;

export default function RoleList() {
    const [dataSource, setDataSource] = useState([]);

    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [treeData, setTreeData] = useState([]);

    const [currentRights, setCurrentRights] = useState([]);

    const [currentId, setCurrentId] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => {
            // 修改数据的label属性名为title
            setDataSource(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:5000/rights?_embed=children`).then(res => {
            setTreeData(res.data);
        })
    }, []);


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: "角色名称",
            dataIndex: "roleName"
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
                            <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => showModal(item)}></Button>
                        </Tooltip>
                        <Modal title="权限分配" open={isModalOpen} onOk={() => handleOk(item)} onCancel={handleCancel}>
                            <Tree
                                checkedKeys={currentRights}
                                onCheck={onCheck}
                                treeData={treeData}
                                checkable
                                checkStrictly
                                // 数据和属性不匹配需要用fieldNamed改变
                                fieldNames={{ title: "label" }}
                            />
                        </Modal>
                    </div >
                )
            }
        }
    ];
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
        axios.delete(`http://localhost:5000/roles/${item.id}`);
        setLoading(false);
    }

    // Modal相关
    const showModal = (item) => {
        setIsModalOpen(true);
        setCurrentRights(item.rights);
        setCurrentId(item.id);
    };
    const handleOk = (item) => {
        setIsModalOpen(false);
        // 同步侧边栏
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return { ...item, rights: currentRights };
            }
            return item;
        }))
        // 同步后端
        axios.patch(`http://localhost:5000/roles/${currentId}`, { rights: currentRights });
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Tree相关
    const onCheck = (checkedKeys) => {
        setCurrentRights(checkedKeys);
    };


    return (
        <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={false} loading={loading}></Table>
    )
}