import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Steps, Form, Input, Select, message, notification } from 'antd';
import axios from 'axios';
import NewsEditor from '../../../components/NewsSandBox/NewsEditor';
import "./index.css";

const { Option } = Select;

export default function NewsAdd() {
    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [form] = Form.useForm();
    const [editorContentInfo, setEditorContentInfo] = useState("");
    const [formInfo, setFormInfo] = useState({});
    const user = JSON.parse(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/categories").then(res => {
            setCategoryList(res.data);
        })
    }, [])

    const prev = () => {
        setCurrent(current - 1);
    }

    const next = async () => {
        if (current === 0) {
            try {
                // 检验第一步是否为空
                const values = await form.validateFields();
                setFormInfo(values);
                setCurrent(current + 1);
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        } else {
            // 检验第二步是否为空或<p></p>
            if (editorContentInfo === "" || editorContentInfo.trim() === "<p></p>") {
                message.error("内容不能为空！");
            }else {
                setCurrent(current + 1);
            }
        }
    }

    const getEditorContent = (value) => {
        setEditorContentInfo(value);
    }

    const handleSaveToDraftOrAudit = (auditState) => {
        axios.post('/news', {
            ...formInfo,
            "content": editorContentInfo,
            "region": user.region === "" ? "全球" : user.region,
            "author": user.username,
            "roleId": user.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
        }).then(() => {
            navigate(auditState === 0 ? '/news-manage/draft': '/audit-manage/list');

            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看您的新闻`,
                placement: "bottomRight",
            })
        })
    }
    return (
        <div className='news-add'>
            <div className='news-add-title'>撰写新闻</div>
            <Steps
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: "新闻标题，新闻分类",
                    },
                    {
                        title: '新闻内容',
                        description: '新闻主体内容',
                    },
                    {
                        title: '新闻提交',
                        description: '保存草稿或者提交审核',
                    },
                ]}
            />
            {/* 每一个步骤条的内容 */}
            <div className='news-add-step'>
                {/* 第一步 */}
                <div className={current === 0 ? '' : 'hidden'}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入新闻标题！',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择新闻分类！',
                                },
                            ]}
                        >
                            <Select>
                                {
                                    categoryList.map(item => <Option value={item.id} key={item.id}>{item.label}</Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                {/* 第二步 */}
                <div className={current === 1 ? '' : 'hidden'}>
                    <NewsEditor getEditorContent={getEditorContent} />
                </div>
                <div className={current === 2 ? '' : 'hidden'}></div>
            </div>

            {/* 按钮区 */}
            <div className='news-add-btns'>
                {
                    current > 0 && <Button onClick={prev}>上一步</Button>
                }
                {
                    current < 2 && <Button onClick={next} type='primary'>下一步</Button>
                }
                {
                    current === 2 && <span>
                        <Button type='dashed' onClick={() => handleSaveToDraftOrAudit(0)}>保存草稿箱</Button>
                        <Button type='primary' onClick={() => handleSaveToDraftOrAudit(1)}>提交审核</Button>
                    </span>
                }
            </div>
        </div>
    )
}
