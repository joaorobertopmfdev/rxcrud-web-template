import { AxiosError } from 'axios';
import api from '../../../services/api';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { useForm, SubmitHandler } from 'react-hook-form';
import Redirecionar from '../../../components/redirecionar';
import AcessoBloqueado from '../../../components/acesso-bloqueado';
import { tratarErroApi } from '../../../rxlib/services/utilitarios';
import { usuarioTemPermissao } from '../../../rxlib/services/seguranca';
import { ApiError, CadastroProps, Cidade } from '../../../services/tipos';
import { RxlibLayout } from '../../../rxlib/componentes/layout/rxlib-Layout';
import { ModalWarning } from '../../../rxlib/componentes/modal/modal-warning';
import { ModalPrimary } from '../../../rxlib/componentes/modal/modal-primary';
import { SelectLabelAsync } from '../../../rxlib/componentes/select/select-label-async';

import {
    Breadcrumb,
    InputLabel,
    ButtonsCrud,
    BreadcrumbItem,
} from 'rxlib-react';

function CidadeCadastro(props: CadastroProps) {
    const [salvo, setSalvo] = useState<boolean>(false);
    const [carregando, setCarregando] = useState<boolean>(false);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [showPrimary, setShowPrimary] = useState<boolean>(false);
    const [token] = useState(useAppSelector(state => state.token));
    const [messageWarning, setMessageWarning] = useState<string[]>([]);
    const [messagePrimary, setMessagePrimary] = useState<string[]>([]);

    const [cidade, setCidade] = useState<Cidade>({
        id: '',
        idEstado: '',
        descricao: ''        
    });

    const { register, handleSubmit } = useForm<Cidade>();

    const handleHideWarning = () => setShowWarning(false);

    const handleHidePrimary = () => {
        setShowPrimary(false);
        setSalvo(true);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { texto: 'Home', link: '/home' },
        { texto: 'Cidades', link: '/cidade' },
        { texto: props.match.params.action ? 'Visualização' : props.match.params.id ? 'Edição' : 'Novo', link: '' },
    ];

    useEffect(() => {
        if (props.match.params.id) {
            api.get(`/Cidade/${props.match.params.id}`)
                .then(response => {
                    setCidade({
                        id: response.data.id,
                        idEstado: response.data.idEstado,
                        descricao: response.data.descricao,
                    });
                }).catch((error: AxiosError<ApiError>) => {
                    tratarErro(error);
            });
        }
    }, [props.match.params.id]);

    const onSubmit: SubmitHandler<Cidade> = data => {
        setCarregando(true);
        props.match.params.id
            ? editar(data)
            : salvar(data);
    }

    function salvar(data: Cidade) {
        api.post('/Cidade', data)
            .then(response => {
                informarSucesso();
            }).catch((error: AxiosError<ApiError>) => {
                tratarErro(error);
            });
    }

    function editar(data: Cidade) {
        api.put('/Cidade', data)
            .then(response => {
                informarSucesso();
            }).catch((error: AxiosError<ApiError>) => {
                tratarErro(error);
            });
    }

    function informarSucesso() {
        setMessagePrimary(['Cidade salvo com sucesso.']);
        setShowPrimary(true);
    }

    function tratarErro(error: AxiosError<ApiError>) {
        setCarregando(false);
        setMessageWarning(tratarErroApi(error, 'Não foi possível salvar o cidades: '));
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
                                <h6>{props.match.params.action ? 'Visualizar' : props.match.params.id ? 'Editar' : 'Novo'} cidade</h6>
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
                                            defaultValue={cidade.id}
                                            placeholder='Código da cidade'
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
                                    defaultValue={cidade.descricao}
                                    placeholder='Descrição da cidade'
                                    referencia={register({ required: true })}
                                    readOnly={props.match.params.action === 'view'} />
                            </div>
                        </div>
                        <div className='row px-1'>
                            <div className='col-12 mt-1'>
                                <SelectLabelAsync
                                    foco='sim'
                                    type='Estado'
                                    name='idEstado'
                                    label='Estado:'
                                    id='inputIdEstado'
                                    action={props.match.params.action}
                                    referencia={register({ required: true })}
                                    valorSelecionado={cidade.idEstado} />
                            </div>
                        </div>
                        <ButtonsCrud
                            styleButton='btn-rxlib'
                            carregando={carregando}
                            linkCancelarVoltar='/cidade'
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
                    para='/cidade' />
            </RxlibLayout>
        </>
    );
}

export default CidadeCadastro;