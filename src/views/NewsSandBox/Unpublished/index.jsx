import React from 'react';
import { Button } from 'antd';
import NewsPublish from '../../../components/NewsPublish';
import usePublish from '../../../hooks/usePublish';

export default function Unpublished() {
    const { dataSource, handlePublish } = usePublish(1);
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary' onClick={() => handlePublish(id)}>发布</Button>}></NewsPublish>
        </div>
    )
}
