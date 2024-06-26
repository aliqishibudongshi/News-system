import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Avatar, List, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts';
import _ from "lodash"

const { Meta } = Card;

export default function Home() {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [open, setOpen] = useState(false);
    const [pieChart, setPieChart] = useState(null);
    const [allList, setAllList] = useState([]);
    const barChartRef = useRef();
    const pieChartRef = useRef();
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=10`).then(res => {
            setViewList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=10`).then(res => {
            setStarList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            setAllList(res.data);
            renderBarView(_.groupBy(res.data, item => item.category.label));
        });
        return () => {
            window.onresize = null;
        }
    }, []);

    const onClose = () => {
        setOpen(false);
    };

    const renderBarView = (obj) => {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(barChartRef.current);
        // 绘制图表
        myChart.setOption({
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    interval: 0,
                    rotate: 45
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        });
        window.onresize = () => {
            myChart.resize();
        };
    };

    const renderPieView = () => {
        // 数据处理
        let personList = allList.filter(item => item.author === username);
        let groupByObj = _.groupBy(personList, item => item.category.label);
        let dataList = [];
        for (let i in groupByObj) {
            dataList.push({
                value: groupByObj[i].length,
                name: i
            });
        };
        // 基于准备好的dom，初始化echarts实例
        let myChart;
        if (!pieChart) {
            myChart = echarts.init(pieChartRef.current);
            setPieChart(myChart);
        } else {
            myChart = pieChart;
        }
        // 绘制图表
        myChart.setOption({
            title: {
                text: '当前用户新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: dataList,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });
        window.onresize = () => {
            myChart.resize();
        };
    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => <List.Item>
                                <Link to={`/news-manage/preview/${item.id}`}>{item.label}</Link>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => <List.Item>
                                <Link to={`/news-manage/preview/${item.id}`}>{item.label}</Link>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <PieChartOutlined key="chart" onClick={() => {
                                setOpen(true);
                                setTimeout(() => {
                                    renderPieView()
                                }, 1000);
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region === "" ? "全球" : region}</b>
                                    <span style={{ paddingLeft: '20px' }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            {/* 抽屉组件相关 */}
            <Drawer title="个人新闻分类" onClose={onClose} open={open} width={"500px"}>
                <div ref={pieChartRef} style={{ width: '100%', height: '400px', marginTop: '50px' }}></div>
            </Drawer>
            {/* 柱状图相关 */}
            <div ref={barChartRef} style={{ width: '100%', height: '400px', marginTop: '50px' }}></div>
        </div>
    )
}
