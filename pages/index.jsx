// pages/index.js

import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

export default function Home() {
  return (
    <Container className="text-center mt-5">
      <h1>Página Inicial</h1>
      <Row className="justify-content-center mt-3">
        <Col>
          <Link href="/login" className="btn btn-primary">
            Ir para a página de login
          </Link>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col>
          <Link href="/menu" className="btn btn-secondary">
            Ir para a página de Menu
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
