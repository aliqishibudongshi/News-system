import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'antd';

export default function NewsPublish(props) {
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
                        {props.button(item.id)}
                    </div >
                )
            }
        },
    ];
    return (
        <div>{/* Table相关 */}
            <Table dataSource={props.dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id}></Table>
        </div>
    )
}
