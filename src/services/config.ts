/* RXLib Config */

import { TipoColunaTabelaBase } from '../rxlib/componentes/table';
import { Item, Menu } from '../rxlib/componentes/layout/rxlib-Layout';
import { RequestType } from '../rxlib/componentes/select/select-label-async';

/* SelectLabelAsync */

export const SelectLabelAsyncPrimaryColor = '#FDA227';
export const SelectLabelAsyncDisabledColor = '#CCCCCC';
export const SelectLabelAsyncSecondaryColor = '#FFFFFF';

export type DataType = 'DadosFixos' | 'Exemplo';

export const RequestTypeArray: RequestType[] = [
    {
        useOdata: true,
        type: 'Exemplo',
        fieldValue: 'fieldValue',
        fieldLabel: 'fieldLabel',
        fieldValueLowerCase: 'fieldValueLowerCase',
        fieldLabelLowerCase: 'fieldLabelLowerCase',
        url: '/OData/Exemplo?$filter=contains(toupper(nome),toupper(\'selectedValue\'))',
    },
];

/* RxlibLayout */

export const NomeEmpresa = 'RXCrud';
export const UsarSidebarLayout = false;
export const SecretKey = '9dec7339f2de4d61';
export const UsarSidebarBodyGradient = false;
export const ExibirNomeEmpresaNavbarLayout = false;

export function montarMenus(token: string, administrador: boolean): Menu {
    let menus: Menu = {
        items: [],
    };

    let item: Item = {
        nome: 'Cadastros',
        subItens: [],
    }

    item.subItens.push({
        nome: 'Usuários',
        link: '/usuario',
    });

    item.subItens.push({
        nome: 'Cidade',
        link: '/cidade',
    });

    menus.items.push(item);

    return menus;
}

/* Table  */

export type TipoColunaTabela = TipoColunaTabelaBase;