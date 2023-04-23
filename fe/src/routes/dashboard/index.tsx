import { styled } from "solid-styled-components";
import { Col, Row } from "~/components/Grid";
import { Layout } from "~/components/Layout";
import { useProtectedRoute } from "~/state/auth";

const Card = styled("div")`
  background: var(--surface);
  box-shadow: 0px 24px 64px -24px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 36vh;
  border-radius: 16px;
`;

export default function DashboardRoute() {
  useProtectedRoute();
  return (
    <Layout name="Dashboard">
      <div style="margin-top: 24px" />
      <Row gutter={24}>
        <Col lg={12} size={3}>
          <Card />
        </Col>
        <Col lg={12} size={3}>
          <Card />
        </Col>
        <Col lg={12} size={6}>
          <Card />
        </Col>
        <Col lg={12} size={3}>
          <Card />
        </Col>
        <Col lg={12} size={6}>
          <Card />
        </Col>
        <Col lg={12} size={3}>
          <Card />
        </Col>
      </Row>
    </Layout>
  );
}
