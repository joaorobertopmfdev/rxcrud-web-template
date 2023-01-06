import { AxiosError } from 'axios';
import api from '../../../services/api';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { useForm, SubmitHandler } from 'react-hook-form';
import Redirecionar from '../../../components/redirecionar';
import AcessoBloqueado from '../../../components/acesso-bloqueado';
import { tratarErroApi } from '../../../rxlib/services/utilitarios';
import { usuarioTemPermissao } from '../../../rxlib/services/seguranca';
import { ApiError, CadastroProps, Estado } from '../../../services/tipos';
import { RxlibLayout } from '../../../rxlib/componentes/layout/rxlib-Layout';
import { ModalWarning } from '../../../rxlib/componentes/modal/modal-warning';
import { ModalPrimary } from '../../../rxlib/componentes/modal/modal-primary';

import {
    Breadcrumb,
    InputLabel,
    ButtonsCrud,
    BreadcrumbItem,
} from 'rxlib-react';

function EstadoCadastro(props: CadastroProps) {
    const [salvo, setSalvo] = useState<boolean>(false);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [showPrimary, setShowPrimary] = useState<boolean>(false);
    const [token] = useState(useAppSelector(state => state.token));
    const [messageWarning, setMessageWarning] = useState<string[]>([]);
    const [messagePrimary, setMessagePrimary] = useState<string[]>([]);

    const [estado, setEstado] = useState<Estado>({
        id: '',
        descricao: '',
    });

    const { register, handleSubmit } = useForm<Estado>();

    const handleHideWarning = () => setShowWarning(false);

    const handleHidePrimary = () => {
        setShowPrimary(false);
        setSalvo(true);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { texto: 'Home', link: '/home' },
        { texto: 'Estados', link: '/estado' },
        { texto: props.match.params.action ? 'Visualização' : props.match.params.id ? 'Edição' : 'Novo', link: '' },
    ];

    useEffect(() => {
        if (props.match.params.id) {
            api.get(`/Estado/${props.match.params.id}`)
                .then(response => {
                    setEstado({
                        id: response.data.id,
                        descricao: response.data.descricao,
                    });
                }).catch((error: AxiosError<ApiError>) => {
                    tratarErro(error);
                });
        }
    }, [props.match.params.id]);

    const onSubmit: SubmitHandler<Estado> = data => {
        setCarregando(true);
        props.match.params.id
            ? editar(data)
            : salvar(data);
    }

    function salvar(data: Estado) {
        api.post('/Estado', data)
            .then(response => {
                informarSucesso();
            }).catch((error: AxiosError<ApiError>) => {
                tratarErro(error);
            });
    }

    function editar(data: Estado) {
        api.put('/Estado', data)
            .then(response => {
                informarSucesso();
            }).catch((error: AxiosError<ApiError>) => {
                tratarErro(error);
            });
    }

    function informarSucesso() {
        setMessagePrimary(['Estado salvo com sucesso.']);
        setShowPrimary(true);
    }

    function tratarErro(error: AxiosError<ApiError>) {
        setCarregando(false);
        setMessageWarning(tratarErroApi(error, 'Não foi possível salvar o estados: '));
        setShowWarning(true);
    }

    return (
        <>
            <RxlibLayout>
                <Breadcrumb
                    itens={breadcrumbs} />
                <form onSubmit={handleSubmit(onSubmit)} className='rxlib-form'>
                    <div className='container-fluid'>
                        <div className='row px-1'>
                            <div className='col-12'>
                                <h6>{props.match.params.action ? 'Visualizar' : props.match.params.id ? 'Editar' : 'Novo'} estado</h6>
                            </div>
                        </div>
                        {
                            props.match.params.id
                                ? <div className='row px-1'>
                                    <div className='col-12 mt-1'>
                                        <InputLabel
                                            name='id'
                                            type='text'
                                            id='inputId'
                                            maxLength={50}
                                            readOnly={true}
                                            label='Código:'
                                            autoFocus={false}
                                            defaultValue={estado.id}
                                            placeholder='Código da estado'
                                            referencia={register({ required: true })} />
                                    </div>
                                </div>
                                : ''
                        }
                        <div className='row px-1'>
                            <div className='col-12 mt-1'>
                                <InputLabel
                                    type='text'
                                    maxLength={50}
                                    autoFocus={true}
                                    name='descricao'
                                    label='Descrição:'
                                    id='inputDescricao'
                                    defaultValue={estado.descricao}
                                    placeholder='Descrição da estado'
                                    referencia={register({ required: true })}
                                    readOnly={props.match.params.action === 'view'} />
                            </div>
                        </div>
                        <ButtonsCrud
                            styleButton='btn-rxlib'
                            carregando={carregando}
                            linkCancelarVoltar='/estado'
                            visualizar={props.match.params.action === 'view'} />
                    </div>
                </form>
                <ModalWarning
                    show={showWarning}
                    message={messageWarning}
                    onHide={handleHideWarning} />
                <ModalPrimary
                    show={showPrimary}
                    message={messagePrimary}
                    onHide={handleHidePrimary} />
                <Redirecionar
                    se={salvo}
                    para='/estado' />
            </RxlibLayout>
        </>
    );
}

export default EstadoCadastro;