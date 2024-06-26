import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Descriptions, Tag } from 'antd';
import { ArrowLeftOutlined, HeartTwoTone } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import "./index.css";

export default function NewsDetail() {
    const [newsInfo, setNewsInfo] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1
            });
            return res.data;
        }).then(res => {
            axios.patch(`/news/${id}`, {
                view: res.view + 1
            });
        })
    }, [id]); // 注意空数组作为第二个参数，表示仅在组件挂载时执行一次


    // 增加点赞量
    const handleStarAdd = () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        });
        axios.patch(`/news/${id}`, {
            star: newsInfo.star + 1
        });
    }
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
            label: '发布时间',
            children: newsInfo?.publishTime ? moment(newsInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : "-",
        },
        {
            key: '4',
            label: '区域',
            children: newsInfo?.region,
        },
        {
            key: '5',
            label: '访问数量',
            children: newsInfo?.view,
        },
        {
            key: '6',
            label: '点赞数量',
            children: newsInfo?.star,
        },
        {
            key: '7',
            label: '评论数量',
            children: 0,
        },
        {
            key: '8',
            label: '点点赞',
            children: <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStarAdd} />,
        }
    ];

    return (
        <div className='news-detail'>
            {
                newsInfo && <div className='news-detail-container'>
                    <Link className='news-detail-back' to={-1} >
                        <ArrowLeftOutlined />
                        <span className='back'>返回</span>
                    </Link>
                    <Descriptions title={newsInfo.label} items={items} />
                    <div className='news-detail-content' dangerouslySetInnerHTML={{ __html: newsInfo.content }}></div>
                </div>
            }
        </div>
    )
}
