"use client";

import React from 'react';
import { Button } from 'react-bootstrap';
import { useContext, useEffect, useState } from "react";
import { MessageCallbackContext } from "../layout"
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import zxcvbn from "zxcvbn"; // biblioteca para criação de seha "forte"

const schema = yup.object({
    nome: yup.string()
        .min(5, 'O nome deve possuir, no mínimo, 5 caracteres')
        .required('O nome é obrigatório'),

    dataNascimento: yup.date()
        .required('A data de nascimento é obrigatória')
        .typeError('A data de nascimento é obrigatória'),

    email: yup.string()
        .email('Digite um e-mail válido')
        .required('O e-mail é obrigatório'),

    senha: yup.string()
        .test("Informe uma Senha-forte", "A senha deve ser forte, com 8 caracteres com maiúsculo, minúsculo, número e um caractere especial", (value) => {
            const result = zxcvbn(value);
            return result.score >= 3; // pontuação mínima para uma senha ser considerada forte = contém uma combinação de caracteres maiúsculos, minúsculos, números e um caractere especial e comprimento de 8 caracteres.
        })
        .required('A senha é obrigatória'),

}).required();

const UsuarioNovo = () => {

  const messageCallback = useContext(MessageCallbackContext);  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    const url = '/api/usuario';
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
            if (result.status == 200) {
                //ações em caso de sucesso
                messageCallback({ tipo: 'sucesso', texto: resultData });
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


  return (
    <div className='container'>
        <h2>Cadastro de Usuário</h2>
        <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>

            <div className="form-floating mt-2 col-md-8">                
              <input type="text" className="form-control" {...register("nome")}/>
              <label>Nome</label>
              <span className='text-danger'>{errors.nome?.message}</span>
            </div>

            <div className="form-floating mt-2 col-md-4">
              <input type="date" className="form-control" {...register("dataNascimento")} />
              <label>Data de Nascimento</label>
              <span className="text-danger">{errors.dataNascimento?.message}</span>
            </div>

            <div className="form-floating mt-2 col-md-6">
              <input type="email" className="form-control" {...register("email")} />
              <label>E-mail</label>
              <span className='text-danger'>{errors.email?.message}</span>
            </div>
            
            <div className="form-floating mt-2 col-md-6">
              <input type="password" className="form-control" {...register("senha")} />
              <label>Senha</label>
              <span className='text-danger'>{errors.senha?.message}</span>
            </div>

            <Button type="submit" variant="primary">Cadastrar</Button>

        </form>
        
    </div>
  );
};

export default UsuarioNovo;