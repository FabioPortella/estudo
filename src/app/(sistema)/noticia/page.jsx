"use client"

import TipoCursoNovo from "./novo"
import {Table } from "react-bootstrap";
import { useEffect, useState } from "react";

export const metadata = {
    title: 'Blog de Noticias'
}

export default function Page(){

    const [grid, setGrid] = useState(null);
    const [atualizarGrid, setAtualizarGrid]  = useState(null);
    const pesquisar = () => {
        fetch('/api/noticia').then((result) => {
            result.json().then((data) => {
                let finalGrid = data.map((p) =>
                    <tr key={p.id}>
                        <td>{p.titulo}</td>
                        <td>{p.subtitulo}</td>
                    </tr>
                );
                setGrid(finalGrid);
            })
        }
    );
    }

    useEffect(()=>{
        if(atualizarGrid === null)
            setAtualizarGrid(true);        
        if(atualizarGrid){
            setAtualizarGrid(false);
            pesquisar();
        }
    },[atualizarGrid])

    return(
        <>
        <div class="container">
        <h2>Projeto Blog de Notícias</h2>
            
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Subtitulo</th>
                    </tr>
                </thead>
                <tbody>
                    {grid}
                </tbody>
            </Table>
            
            <TipoCursoNovo/>
            </div>
        </>
    )
}