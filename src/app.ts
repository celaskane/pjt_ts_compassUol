/// <reference path="./models/arrasta-solta.ts" />
/// <reference path="./models/projeto.ts" />
/// <reference path="./state/projeto-estado.ts" />
/// <reference path="./util/validacao.ts" />
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./components/projeto-entrada.ts" />
/// <reference path="./components/projeto-lista.ts" />

namespace App {
    new ProjetoEntrada();
    new ProjetoLista('active');
    new ProjetoLista('finished');
}