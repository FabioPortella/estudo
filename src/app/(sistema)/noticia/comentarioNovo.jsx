'use client'

import { Button, Modal } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { MessageCallbackContext } from "../layout"
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import BusyButton from "@/app/componentes/busybutton";

const schema = yup.object({
    noticia: yup.number().required('O titulo é obrigatório'),
    
    autor: yup.number().required('O código do autor é obrigatório'),

    data: yup.date().required('A data é obrigatória'),

    texto: yup.string()
        .min(5, 'O comentário  deve conter, no mínimo, 5 caracteres')
        .required('O texto do comentário é obrigatória'),

}).required();

export default function ComentarioNovo() {

    const messageCallback = useContext(MessageCallbackContext);

    const [busy, setBusy] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        setBusy(true);
        const url = '/api/comentario';
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
            reset({ noticia: '', autor: '', data: '', texto: '' })
        }
    }, [modalShow, reset]);

    return (
        <>
            <Button onClick={() => setModalShow(true)}>Cadastrar um comentário</Button>

            <Modal size="md" centered show={modalShow}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header>
                        <Modal.Title>Nova Notícia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label className="row mx-2 mt-2">
                            Noticia
                            <input type="number" className="form-control" {...register("noticia")} />
                            <span className='text-danger'>{errors.autor?.message}</span>
                        </label>        

                        <label className="row mx-2 mt-2">
                            Autor
                            <input type="number" className="form-control" {...register("autor")} />
                            <span className='text-danger'>{errors.autor?.message}</span>
                        </label>  

                        <label className="row mx-2 mt-2">
                            Data
                            <input type="date" className="form-control" {...register("data")} />
                            <span className='text-danger'>{errors.data?.message}</span>
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