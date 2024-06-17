import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from "antd";
import axios from 'axios';

export default function usePublish(type) {
    const [dataSource, setDataSource] = useState([]);
    const { username } = JSON.parse(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setDataSource(res.data);
        })
    }, [username, type]);

    const handlePublish = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now(),
        }).then(() => {
            navigate(`/publish-manage/published`);
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已发布】中查看您的新闻`,
                placement: "bottomRight",
            });
        });
    }

    const handleSunset = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/news/${id}`, {
            publishState: 3
        }).then(() => {
            navigate(`/publish-manage/sunset`);
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已下线】中查看您的新闻`,
                placement: "bottomRight",
            });
        });
    }

    const handleDelete = (id) => {
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.delete(`/news/${id}`).then(() => {
            notification.info({
                message: `通知`,
                description:
                    `您已经成功删除该新闻`,
                placement: "bottomRight",
            });
        });
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}
