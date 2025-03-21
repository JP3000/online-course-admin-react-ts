import { Card, Col, Row } from "antd";
import "./index.css";
import styled from "styled-components";
import * as echarts from "echarts";
import { useEffect } from "react";
import bar from "./options/bar";
import line from "./options/line";
import pie from "./options/pie";
import { chartGet } from "../../api/course";

export default function DashBoard() {
  useEffect(() => {
    const barChart = echarts.init(document.getElementById("bar"));
    barChart.setOption(bar);

    const lineChart = echarts.init(document.getElementById("line"));
    lineChart.setOption(line);

    const pieChart = echarts.init(document.getElementById("pie"));
    // 发请求
    chartGet().then((res) => {
      // console.log("data", res);
      pie.series[0].data = res.data.results[0].info.data;
      pieChart.setOption(pie); // 这一句必须等到后端数据下发后再执行
    });
  }, []);

  return (
    <div>
      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <div className="box" id="line">
              图表
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <ChartWrapper id="bar" />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <ChartWrapper id="pie" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const ChartWrapper = styled.div`
  height: 300px;
  border: 1px solid #4455dd;
`;
