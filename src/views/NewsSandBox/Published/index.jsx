import React from 'react';
import { Button } from 'antd';
import NewsPublish from '../../../components/NewsPublish';
import usePublish from '../../../hooks/usePublish';

export default function Published() {
    const { dataSource, handleSunset } = usePublish(2);
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button onClick={() => handleSunset(id)}>下线</Button>}></NewsPublish>
        </div>
    )
}
