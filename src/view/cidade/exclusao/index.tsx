import { AxiosError } from 'axios';
import { Modal } from 'react-bootstrap';
import api from '../../../services/api';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ApiError, FormExclusao } from '../../../services/tipos';
import { Exclusao } from '../../../rxlib/componentes/layout/exclusao';

import {
    Spinner,
} from 'rxlib-react';

interface CidadeExclusaoProps {
    show: boolean;
    idCidade: string;
    onHide: () => void;
    onExcluir: (valor: boolean) => void;
    tratarErro: (error: AxiosError<ApiError>, mensagem: string) => void;
}

function CidadeExclusao(props: CidadeExclusaoProps) {
    const [descricao, setDescricao] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(false);
    const [carregandoCidade, setCarregandoCidade] = useState<boolean>(false);

    const { handleSubmit } = useForm<FormExclusao>();

    useEffect(() => {
        if (props.show) {
            setCarregandoCidade(true);
            api.get(`/Cidade/${props.idCidade}`)
                .then(response => {
                    setDescricao(response.data.descricao);
                    setCarregandoCidade(false);
                }).catch((error: AxiosError<ApiError>) => {
                    setCarregandoCidade(false);
                    props.tratarErro(error, 'Não foi possível realizar a consulta: ');
                });
        }
    }, [props]);

    const onSubmit: SubmitHandler<FormExclusao> = data => {
        setCarregando(true);
        api.delete(`/Cidade/${props.idCidade}`, data)
            .then(response => {
                informarSucesso();
            }).catch((error: AxiosError<ApiError>) => {
                setCarregando(false);
                props.tratarErro(error, 'Não foi possível excluir a cidade: ');
            });
    }

    function informarSucesso() {
        props.onHide();
        props.onExcluir(true);
        setCarregando(false);
    }

    return (
        <Modal show={props.show} onHide={props.onHide} dialogClassName='rxlib-modal-exclusao' centered>
            <Modal.Body className='rxlib-modal-exclusao-body'>
                {
                    carregandoCidade
                        ? <Spinner
                            classStyle='rxlib-spinner' />
                        : <Exclusao
                            carregando={carregando}
                            onCancelar={props.onHide}
                            onSubmit={handleSubmit(onSubmit)}
                            titulo={`Deseja realmente excluir a cidade ${descricao}?`} />
                }
            </Modal.Body>
        </Modal>
    );
}

export default CidadeExclusao;