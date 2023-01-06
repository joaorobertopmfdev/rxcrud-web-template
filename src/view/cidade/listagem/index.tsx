import { AxiosError } from 'axios';
import api from '../../../services/api';
import CidadeExclusao from '../exclusao';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { ApiError, ListagemProps } from '../../../services/tipos';
import AcessoBloqueado from '../../../components/acesso-bloqueado';
import { Listagem } from '../../../rxlib/componentes/layout/listagem';
import { usuarioTemPermissao } from '../../../rxlib/services/seguranca';
import { RxlibLayout } from '../../../rxlib/componentes/layout/rxlib-Layout';
import { ModalWarning } from '../../../rxlib/componentes/modal/modal-warning';
import { AcoesTabela, ConfiguracoesTabela } from '../../../rxlib/componentes/table';
import { obterQuantidadeParaPular, tratarErroApi } from '../../../rxlib/services/utilitarios';

import {
    Breadcrumb,
    BreadcrumbItem,
} from 'rxlib-react';

function CidadeListagem(props: ListagemProps) {
    const [cidades, setCidades] = useState<[{}]>([{}]);
    const [idCidade, setIdCidade] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(false);
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const [token] = useState(useAppSelector(state => state.token));
    const [showExclusao, setShowExclusao] = useState<boolean>(false);
    const [quantidadeTotal, setQuantidadeTotal] = useState<number>(0);
    const [messageWarning, setMessageWarning] = useState<string[]>([]);
    const [realizarConsulta, setRealizarConsulta] = useState<boolean>(true);

    const handleHide = () => setShowWarning(false);

    const handleHideExclusao = () => setShowExclusao(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { texto: 'Home', link: '/home' },
        { texto: 'Cidades', link: '' },
    ];

    const configuracoesTabela: ConfiguracoesTabela = {
        mensagemPadrao: 'Não foram encontrados resultados para a consulta.',
        colunas: [
            { nome: 'Descricão', campo: 'Descricao', tipo: 'string' },
        ],
    }

    const quantidadeRegistrosPorPagina = 10;
    const quantidadeParaPular = obterQuantidadeParaPular(parseInt(props.match.params.pagina), quantidadeRegistrosPorPagina);

    const linkNovo = '/cidade/novo';
    const linkEdicao = '/cidade/editar';
    const handleExclusao = handleExcluir;

    useEffect(() => {
        if ((realizarConsulta)) {
            setCarregando(true);
            api.get(`/OData/Cidade?$count=true&$top=${quantidadeRegistrosPorPagina}&$skip=${quantidadeParaPular}`)
                .then(response => {
                    setTimeout(() => {
                        setQuantidadeTotal(response.data['@odata.count']);
                        setCidades(response.data.value);
                        setRealizarConsulta(false);
                        setCarregando(false);
                    }, 250);
                }).catch((error: AxiosError<ApiError>) => {
                    setCarregando(false);
                    setMessageWarning(tratarErroApi(error, 'Não foi possível realizar a consulta: '));
                    setShowWarning(true);
                });
        }
    }, [quantidadeParaPular, realizarConsulta]);

    function handleExcluir(id: string) {
        setIdCidade(id);
        setShowExclusao(true);
    }

    function tratarErro(error: AxiosError<ApiError>, mensagem: string) {
        setCarregando(false);
        setMessageWarning(tratarErroApi(error, mensagem));
        setShowWarning(true);
    }

    function obterAcoesPersonalizadas(): AcoesTabela[] {
        const acoesPersonalizadas: AcoesTabela[] = [];

        if (usuarioTemPermissao(token, 'uf_cidade_visualizar')) {
            acoesPersonalizadas.push({ link: '/cidade/ufcidade', nome: 'Ufs do cidade', iconeClassName: 'fas fas fa-solid fa-route' });
        }

        return acoesPersonalizadas;
    }

    return (
        <>
            <RxlibLayout>
                <Breadcrumb
                    itens={breadcrumbs} />
                <Listagem
                    campoId='Id'
                    linkNovo={linkNovo}
                    tipoBotaoAcao='button'
                    fonteDados={cidades}
                    listagemDetalhe={false}
                    carregando={carregando}
                    linkEdicao={linkEdicao}
                    linkListagem='/cidade'
                    onExcluir={handleExclusao}
                    descricao='Listagem de cidades'
                    linkVisualizacao='/cidade/visualizar'
                    configuracoesTabela={configuracoesTabela}
                    quantidadeTotalRegistros={quantidadeTotal}
                    acoesPersonalizadas={obterAcoesPersonalizadas()}
                    paginaAtual={parseInt(props.match.params.pagina)}
                    quantidadeRegistrosPorPagina={quantidadeRegistrosPorPagina} />
                <ModalWarning
                    show={showWarning}
                    onHide={handleHide}
                    message={messageWarning} />
                <CidadeExclusao
                    show={showExclusao}
                    idCidade={idCidade}
                    tratarErro={tratarErro}
                    onHide={handleHideExclusao}
                    onExcluir={setRealizarConsulta} />
            </RxlibLayout>
        </>
    );
}

export default CidadeListagem;