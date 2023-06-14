'use client'

import { Button, Modal } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { MessageCallbackContext } from "../layout"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import BusyButton from "@/app/componentes/busybutton";

const schema = yup.object({
    titulo: yup.string()
        .min(3, 'O titulo da notícia deve conter, no mínimo, 3 caracteres')
        .max(150, 'O titulo da noticia deve conter, no máximo, 150 caracteres')
        .required('O titulo é obrigatório'),

    subtitulo: yup.string()
        .min(10, 'O subtitulo da notícia deve conter, no mínimo, 10 caracteres')
        .max(150, 'O subtitulo da noticia deve conter, no máximo, 150 caracteres')
        .required('O subtitulo é obrigatório'),

    data: yup.date().required('A data é obrigatória'),

    autor: yup.number().required('O código do autor é obrigatório'),
       
    texto: yup.string()
        .min(5, 'O texto da notícia deve conter, no mínimo, 5 caracteres')
        .required('O texto da notícia é obrigatória'),

}).required();

export default function TipoCursoNovo() {

    const messageCallback = useContext(MessageCallbackContext);

    const [busy, setBusy] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        setBusy(true);
        const url = '/api/noticia';
        var args = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    
        fetch(url, args).then((result) => {
            result.json().then((resultData) => {
                setBusy(false);
                if (result.status == 200) {
                    //ações em caso de sucesso
                    messageCallback({ tipo: 'sucesso', texto: resultData });
                    handleClose();
                }
                else {
                    //ações em caso de erro
                    let errorMessage = '';
                    if (resultData.errors != null) {
                        const totalErros = Object.keys(resultData.errors).length;
    
                        for (var i = 0; i < totalErros; i++) {
                            errorMessage = errorMessage + Object.values(resultData.errors)[i] + "<br/>";
                        }
                    }
                    else
                        errorMessage = resultData;
    
                    messageCallback({ tipo: 'erro', texto: errorMessage });
                }
            }
            )
        });
    }

    const handleClose = () => {
        setModalShow(false);
    }

    useEffect(() => {
        if (modalShow === false) {
            reset({ nome: '', descricao: '' })
        }
    }, [modalShow, reset]);

    return (
        <>
            <Button onClick={() => setModalShow(true)}>Cadastrar nova notícia</Button>

            <Modal size="md" centered show={modalShow}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>
                        <Modal.Title>Nova Notícia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="row mx-2">
                            Titulo
                            <input type="text" className="form-control"  {...register("titulo")} />
                            <span className='text-danger'>{errors.titulo?.message}</span>
                        </label>                        
                        <label className="row mx-2">
                            Sub Titulo
                            <input type="text" className="form-control"  {...register("subtitulo")} />
                            <span className='text-danger'>{errors.subtitulo?.message}</span>
                        </label>
                        <label className="row mx-2 mt-2">
                            Data
                            <input type="date" className="form-control" {...register("data")} />
                            <span className='text-danger'>{errors.data?.message}</span>
                        </label>

                        <label className="row mx-2 mt-2">
                            Autor
                            <input type="number" className="form-control" {...register("autor")} />
                            <span className='text-danger'>{errors.autor?.message}</span>
                        </label>

                        <label className="row mx-2 mt-2">
                            Texto
                            <textarea className="form-control" style={{ height: '120px' }}  {...register("texto")} />
                            <span className='text-danger'>{errors.texto?.message}</span>
                        </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <BusyButton variant="success" type="submit" label="Salvar">Salvar</BusyButton>
                        <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}