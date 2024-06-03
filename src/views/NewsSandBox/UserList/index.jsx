import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Switch, Input, Select } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";
import "./index.css"
import { useRef } from 'react';

const { confirm } = Modal;
const { Option } = Select;
export default function UserList() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [regionList, setRegionList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [editOneUser, setEditOneUser] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:5000/users?_expand=role").then(res => {
            setDataSource(res.data);
            setLoading(false);
        })
    }, []);
    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:5000/regions").then(res => {
            setRegionList(res.data);
            setLoading(false);
        })
    }, []);
    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:5000/roles").then(res => {
            setRoleList(res.data);
            setLoading(false);
        })
    }, []);


    // Table组件相关
    const columns = [
        {
            title: "区域",
            dataIndex: "region",
            filters: [
                ...regionList.map(item => ({
                    text: item.label,
                    value: item.value
                })),
                {
                    text: "全球",
                    value: "全球"
                }
            ],
            onFilter: (value, item) => {
                if (value === "全球") {
                    return item.region === ""
                }
                return item.region === value
            },
            render: (region) => {
                return (
                    <b>{region ? region : "全球"}</b>
                )
            }
        },
        {
            title: "角色名称",
            dataIndex: "role",
            render: (role) => {
                return role.roleName
            }
        },
        {
            title: "用户名",
            dataIndex: "username",
        },
        {
            title: "用户状态",
            dataIndex: "roleState",
            render: (roleState, item) => {
                return (
                    <Switch checked={roleState} disabled={item.default} onChange={() => handleUserStatus(item)}></Switch>
                )
            }
        },
        {
            title: "操作",
            render: (item) => {
                return (
                    <div className='operate-button'>
                        <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => handleConfirm(item)} disabled={item.default}></Button>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleEdit(item)}></Button>
                    </div >
                )
            }
        },
    ];
    const handleEdit = (item) => {
        setOpen(true);
        setIsAdd(false);
        setEditOneUser(item);
    };

    // 处理用户状态
    const handleUserStatus = (item) => {
        item.roleState = !item.roleState;
        setDataSource([...dataSource]);
        axios.patch(`http://localhost:5000/users/${item.id}`, {
            roleState: item.roleState
        })
    };

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
        axios.delete(`http://localhost:5000/users/${item.id}`);
        setLoading(false);
    }

    // 添加用户相关
    const CollectionCreateForm = ({ onFormInstanceReady }) => {
        const [form] = Form.useForm();
        useEffect(() => {
            onFormInstanceReady(form);
        }, [form, onFormInstanceReady]);
        return (
            <Form layout="vertical" form={form} name="form_in_modal">
                {isAdd ? "" : form.setFieldsValue({ ...editOneUser })}
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[
                        {
                            required: true,
                            message: '请选择角色',
                        },
                    ]}
                >
                    <Select onChange={value => {
                        if (value === 1) {
                            setIsDisabled(true);
                            form.setFieldsValue({ region: "" })
                        } else {
                            setIsDisabled(false);
                        }
                    }}>
                        {
                            roleList.map(item => {
                                return (
                                    <Option value={item.id} key={item.id}>{item.roleName}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisabled ? [] : [
                        {
                            required: true,
                            message: '请选择区域',
                        },
                    ]}
                >
                    <Select disabled={isDisabled}>
                        {
                            regionList.map(item => {
                                return (
                                    <Option value={item.value} key={item.id}>{item.label}</Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        );
    };
    const CollectionCreateFormModal = ({ open, onCreate, onCancel }) => {
        const [formInstance, setFormInstance] = useState();
        return (
            <Modal
                open={open}
                title={isAdd ? "添加用户" : "更新用户"}
                okText={isAdd ? "确定" : "更新"}
                cancelText="取消"
                okButtonProps={{
                    autoFocus: true,
                }}
                onCancel={onCancel}
                destroyOnClose
                onOk={async () => {
                    try {
                        const values = await formInstance?.validateFields();
                        formInstance?.resetFields();
                        onCreate(values);
                    } catch (error) {
                        console.log('Failed:', error);
                    }
                }}
            >
                <CollectionCreateForm
                    onFormInstanceReady={(instance) => {
                        setFormInstance(instance);
                    }}
                />
            </Modal>
        );
    };
    // 添加用户
    const onCreate = (values) => {
        axios.post("http://localhost:5000/users", {
            ...values,
            roleState: true,
            default: values.roleId === 1 ? true : false
        }).then(res => {
            setDataSource([...dataSource, {
                ...res.data,
                role: roleList.filter(item => item.id === values.roleId)[0]
            }])
        })
        setOpen(false);
    };

    //更新用户
    const onUpdate = (values) => {
        setDataSource(dataSource.map(item => {
            if (item.id === editOneUser.id) {
                return {
                    ...item,
                    ...editOneUser,
                    role: roleList.filter(data => data.id === values.roleId)[0]
                }
            }
            return item;
        }));
        setOpen(false);
        axios.patch(`http://localhost:5000/users/${editOneUser.id}`, {
            ...values,
        });
    };

    return (
        <div>
            {/* 添加用户相关 */}
            <Button type="primary" onClick={() => {
                setOpen(true);
                setIsAdd(true);
            }}>
                添加用户
            </Button>
            <CollectionCreateFormModal
                open={open}
                onCreate={isAdd ? onCreate : onUpdate}
                onCancel={() => setOpen(false)}
            />
            {/* Table相关 */}
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} loading={loading} rowKey={item => item.id}></Table>
        </div>
    )
}
