"use client"

import NoticiaNova from "./novo";
import { Card, Row, Col, Collapse } from "react-bootstrap";
import { useEffect, useState } from "react";

export const metadata = {
  title: 'Blog de Noticias'
};

function MyCard({ p }) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Card key={p.id} className="mb-3">
      <Card.Header>
        <Row>
          <Col xs={9} onClick={handleToggle} style={{ cursor: "pointer" }}>
            <Card.Title>{p.titulo}</Card.Title>
          </Col>
          <Col xs={3} className="text-end">
            <small>Data: {p.data}</small>
          </Col>
        </Row>
        <small>{p.subtitulo}</small>
      </Card.Header>
      <Collapse in={open}>
        <Card.Body>
          <Card.Text>{p.texto}</Card.Text>
        </Card.Body>
      </Collapse>
    </Card>
  );
}

export default function Page() {
  const [grid, setGrid] = useState(null);
  const [atualizarGrid, setAtualizarGrid] = useState(null);

  const pesquisar = () => {
    fetch('/api/noticia').then((result) => {
      result.json().then((data) => {
        let finalGrid = data.map((p) => <MyCard key={p.id} p={p} />);
        setGrid(finalGrid);
      });
    });
  };

  useEffect(() => {
    if (atualizarGrid === null) setAtualizarGrid(true);
    if (atualizarGrid) {
      setAtualizarGrid(false);
      pesquisar();
    }
  }, [atualizarGrid]);

  return (
    <>
      <div className="container col-12 m-auto p-4">
        <div>
          <h3 className="text-center">Notícias</h3>
        </div>
        {grid}
        <NoticiaNova />
      </div>
    </>
  );
}
