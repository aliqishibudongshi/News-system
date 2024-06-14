import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Tooltip, Table, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import "./index.css"

const { confirm } = Modal;

export default function NewsCategory() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const EditableContext = React.createContext(null);

    useEffect(() => {
        setLoading(true);
        axios.get('/categories').then(res => {
            setDataSource(res.data);
        })
        setLoading(false);
    }, [])

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current?.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    // 可编辑表格项
    const handleSave = (record) => {
        setDataSource(dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    id: item.id,
                    label: record.label,
                    value: record.label
                }
            }
            return item;
        }));
        axios.patch(`/categories/${record.id}`, {
            label: record.label,
            value: record.label
        })
    }

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
            title: "栏目名称",
            dataIndex: "label",
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: "label",
                title: "栏目名称",
                handleSave
            }),
        },
        {
            title: "操作",
            render: (item) => {
                return (
                    <div className='operate-button'>
                        <Tooltip title='删除'>
                            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => handleConfirm(item)}></Button>
                        </Tooltip>
                    </div >
                )
            }
        },
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
        axios.delete(`/categories/${item.id}`);
        setLoading(false);
    }

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{ pageSize: 5 }}
                loading={loading}
                rowKey={item => item.id}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell
                    }
                }}>
            </Table>
        </div>
    )
}
