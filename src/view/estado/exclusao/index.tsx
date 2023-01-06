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

interface EstadoExclusaoProps {
    show: boolean;
    idEstado: string;
    onHide: () => void;
    onExcluir: (valor: boolean) => void;
    tratarErro: (error: AxiosError<ApiError>, mensagem: string) => void;
}

function EstadoExclusao(props: EstadoExclusaoProps) {
    const [descricao, setDescricao] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(false);
    const [carregandoEstado, setCarregandoEstado] = useState<boolean>(false);

    const { handleSubmit } = useForm<FormExclusao>();

    useEffect(() => {
        if (props.show) {
            setCarregandoEstado(true);
            api.get(`/Estado/${props.idEstado}`)
                .then(response => {
                    setDescricao(response.data.descricao);
                    setCarregandoEstado(false);
                }).catch((error: AxiosError<ApiError>) => {
                    setCarregandoEstado(false);
                    props.tratarErro(error, 'Não foi possível realizar a consulta: ');
                });
        }
    }, [props]);

    const onSubmit: SubmitHandler<FormExclusao> = data => {
        setCarregando(true);
        api.delete(`/Estado/${props.idEstado}`, data)
            .then(response => {
                informarSucesso();
            }).catch((error: AxiosError<ApiError>) => {
                setCarregando(false);
                props.tratarErro(error, 'Não foi possível excluir o estado: ');
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
                    carregandoEstado
                        ? <Spinner
                            classStyle='rxlib-spinner' />
                        : <Exclusao
                            carregando={carregando}
                            onCancelar={props.onHide}
                            onSubmit={handleSubmit(onSubmit)}
                            titulo={`Deseja realmente excluir o estado ${descricao}?`} />
                }
            </Modal.Body>
        </Modal>
    );
}

export default EstadoExclusao;