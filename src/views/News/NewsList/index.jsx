import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Card, Col, Row, List } from "antd";
import axios from 'axios';
import _ from "lodash";
import "./index.css";

export default function NewsList() {
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            // groupBy后的数据是对象，用entries转换成数组的形式
            setList(Object.entries(_.groupBy(res.data, item => item.category.label)));
        });
    }, []);

    return (
        <div className='news-list'>
            <div className='news-list-title'>
                <span className='title'>全球大新闻</span>
                <span className='sub-title'>查看新闻</span>
            </div>
            {/* Card组件 */}
            <div className="cardWrapper">
                {/* gutter属性控制card的左右上下占比 */}
                <Row gutter={[16, 16]}>
                    {
                        list.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={false} hoverable={true}>
                                    <List
                                        size="large"
                                        bordered={false}
                                        dataSource={item[1]}
                                        pagination={{ pageSize: 3 }}
                                        renderItem={(data) => <List.Item>
                                            <Link to={`/detail/${data.id}`}>{data.label}</Link>
                                        </List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    )
}
