import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Descriptions } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import "./index.css";

export default function NewsPreview() {
    const [newsInfo, setNewsInfo] = useState(null);
    const { id } = useParams();
    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo(res.data)
        })
    }, [id]);

    const auditList = ["未审核", "审核中", "已通过", "未通过"]; 
    const publishList = ["未发布", "待发布", "已上线", "已下线"]; 

    const items = [
        {
            key: '1',
            label: '新闻分类',
            children: newsInfo?.category.label,
        },
        {
            key: '2',
            label: '创建者',
            children: newsInfo?.author,
        },
        {
            key: '3',
            label: '创建时间',
            children: moment(newsInfo?.createTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            key: '4',
            label: '发布时间',
            children: newsInfo?.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : "-",
        },
        {
            key: '5',
            label: '区域',
            children: newsInfo?.region,
        },
        {
            key: '6',
            label: '审核状态',
            children: auditList[newsInfo?.auditState],
        },
        {
            key: '7',
            label: '发布状态',
            children: publishList[newsInfo?.publishState],
        },
        {
            key: '8',
            label: '访问数量',
            children: newsInfo?.view,
        },
        {
            key: '9',
            label: '点赞数量',
            children: newsInfo?.star,
        },
        {
            key: '10',
            label: '评论数量',
            children: 0,
        },
    ];

    return (
        <div className='news-preview'>
            {
                newsInfo && <div className='news-preview-container'>
                    <Link className='news-preview-back' to={'/news-manage/draft'}>
                        <ArrowLeftOutlined />
                        <span className='back'>返回</span>
                    </Link>
                    <Descriptions title={newsInfo.label} items={items} />
                    <div className='news-preview-content' dangerouslySetInnerHTML={{__html: newsInfo.content}}></div>
                </div>
            }
        </div>
    )
}
