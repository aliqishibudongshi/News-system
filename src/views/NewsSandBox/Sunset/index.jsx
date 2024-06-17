import React from 'react';
import { Button } from 'antd';
import NewsPublish from '../../../components/NewsPublish';
import usePublish from '../../../hooks/usePublish';

export default function Sunset() {
    const { dataSource, handleDelete } = usePublish(3);
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button danger type='primary' onClick={() => handleDelete(id)}>删除</Button>}></NewsPublish>
        </div>
    )
}
