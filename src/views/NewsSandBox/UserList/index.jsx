import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Switch, Input, Select, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";
import "./index.css"

const { confirm } = Modal;
const { Option } = Select;
export default function UserList() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [regionList, setRegionList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isAdd, setIsAdd] = useState(true);
    const [editOneUser, setEditOneUser] = useState(null);

    // localStorage中把username，region，roleId取出
    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'));
    useEffect(() => {
        setLoading(true);
        // 为了明白123什么意思，对roleId做一个对象映射
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        axios.get("http://localhost:5000/users?_expand=role").then(res => {
            // 这里需要对数据做一个过滤，超级管理员显示全部人员，区域管理员只显示自己和同自己同区域且级别低的。
            setDataSource(roleObj[roleId] === "superadmin" ? res.data : [
                ...res.data.filter(item => item.username === username),
                ...res.data.filter(item => item.region === region && roleObj[item.roleId] === "editor")
            ]);
            setLoading(false);
        })
    }, [region, roleId, username]);

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
                        <Tooltip title="删除">
                            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => handleConfirm(item)} disabled={item.default}></Button>
                        </Tooltip>
                        <Tooltip title="编辑">
                            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleEdit(item)}></Button>
                        </Tooltip>
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

    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    // 根据角色等级禁用【角色】选项
    const checkRoleDisabled = (id) => {
        // 更新状态
        // 超级管理管和非超级管理员
        if (!isAdd) {
            if (roleObj[roleId] === "superadmin") {
                return false;
            } else {
                return true;
            }
        } else {
            // 添加状态
            // 超级管理管和非超级管理员
            if (roleObj[roleId] === "superadmin") {
                return false;
            } else {
                return roleObj[id] !== "editor";
            }
        }
    }

    // 根据角色等级禁用【区域】选项
    const checkRegionDisabled = (value) => {
        // 更新状态
        // 超级管理管和非超级管理员
        if (!isAdd) {
            if (roleObj[roleId] === "superadmin") {
                return false;
            } else {
                return true;
            }
        } else {
            // 添加状态
            // 超级管理管和非超级管理员
            if (roleObj[roleId] === "superadmin") {
                return false;
            } else {
                return value !== region
            }
        }
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
                                    <Option
                                        value={item.id}
                                        key={item.id}
                                        disabled={checkRoleDisabled(item.id)}
                                    >
                                        {item.roleName}
                                    </Option>
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
                                    <Option
                                        value={item.value}
                                        key={item.id}
                                        disabled={checkRegionDisabled(item.value)}
                                    >
                                        {item.label}
                                    </Option>
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
