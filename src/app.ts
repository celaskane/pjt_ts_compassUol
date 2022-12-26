// Type Projeto
enum StatusProjeto { 
    Active, 
    Finished
}

class Projeto {
    constructor(
        public id: string, 
        public titulo: string, 
        public descricao: string, 
        public pessoas: number, 
        public status: StatusProjeto
        ) {

    }
}

// Gerenciamento de Estado do Projeto
type Ouvinte<T> = (itens: T[]) => void;

class Estado<T> {
    protected ouvintes: Ouvinte<T>[] = [];  //protected permite acesso de classes herdeiras

    adicionaOuvinte(ouvinteFn: Ouvinte<T>) {
        this.ouvintes.push(ouvinteFn);
    }
}

class EstadoProjeto extends Estado<Projeto> {
    private projetos: Projeto[] = [];
    private static instance: EstadoProjeto;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new EstadoProjeto();
        return this.instance;
    }

    adicionaProjeto(titulo: string, descricao: string, numPessoas: number) {
        const novoProjeto = new Projeto(
            Math.random().toString(), 
            titulo, 
            descricao, 
            numPessoas,
            StatusProjeto.Active
            );
        this.projetos.push(novoProjeto);
        for (const ouvinteFn of this.ouvintes) {
            ouvinteFn(this.projetos.slice());
        }
    }
}

const estadoProjeto = EstadoProjeto.getInstance();

// Lógica para Validação
interface Validavel {
    valor: string | number;
    requerido?: boolean;
    minTamanho?: number;
    maxTamanho?: number;
    min?: number;
    max?: number;
}

function valida(entradaValidavel: Validavel) {
    let ehValido = true;
    if (entradaValidavel.requerido) {
        ehValido = ehValido && entradaValidavel.valor.toString().trim().length !== 0;
    }
    if (entradaValidavel.minTamanho != null && typeof entradaValidavel.valor === 'string') {
        ehValido = ehValido && entradaValidavel.valor.length > entradaValidavel.minTamanho
    }
    if (entradaValidavel.maxTamanho != null && typeof entradaValidavel.valor === 'string') {
        ehValido = ehValido && entradaValidavel.valor.length < entradaValidavel.maxTamanho
    }
    if (entradaValidavel.min != null && typeof entradaValidavel.valor === 'number') {
        ehValido = ehValido && entradaValidavel.valor > entradaValidavel.min;
    }
    if (entradaValidavel.max != null && typeof entradaValidavel.valor === 'number') {
        ehValido = ehValido && entradaValidavel.valor < entradaValidavel.max;
    }
    return ehValido;
}

// Autobind Decorator
function autobind(
    alvo: any, 
    nomeMetodo: string, 
    descricao: PropertyDescriptor
    ) {
        const metodoOriginal = descricao.value;
        const medotoAjustado: PropertyDescriptor = {
            configurable: true,
            get() {
                const boundFn = metodoOriginal.bind(this);
                return boundFn;
            }
        };
        return medotoAjustado;
    }

// Classe Base Componente
abstract class Componente<T extends HTMLElement, U extends HTMLElement> {
    elementoTemplate: HTMLTemplateElement;
    elementoHost: T;
    elemento: U;

    constructor(
        templateId: string, 
        hostId: string, 
        insereNoInicio: boolean,
        novoElementoId?: string,    //parametros opcionais devem sempre ficar por ultimo
        ) {
            this.elementoTemplate = document.getElementById(templateId)! as HTMLTemplateElement;
            this.elementoHost = document.getElementById(hostId)! as T;
            
            const nodeImportado = document.importNode(this.elementoTemplate.content, true);
            this.elemento = nodeImportado.firstElementChild as U;
            if (novoElementoId){
                this.elemento.id = novoElementoId;
            }

            this.anexo(insereNoInicio);
        }

    private anexo(insereNoComeco: boolean) {
        this.elementoHost.insertAdjacentElement(insereNoComeco ? 'afterbegin' : 'beforeend', this.elemento);
    }

    abstract configure(): void;
    abstract renderizaConteudo(): void;
}

// Classe ProjetoLista
class ProjetoLista extends Componente<HTMLDivElement, HTMLElement> {
    projetosAtribuidos: Projeto[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false,`${type}-projects`);
        this.projetosAtribuidos = [];

        this.configure();
        this.renderizaConteudo();
    }

    configure() {
        estadoProjeto.adicionaOuvinte((projetos: Projeto[]) => {
            const projetosRelevantes = projetos.filter(pjt => {
                if (this.type === 'active') {
                    return pjt.status === StatusProjeto.Active;
                }
                return pjt.status === StatusProjeto.Finished;
            });
            this.projetosAtribuidos = projetosRelevantes;
            this.renderizarProjetos();
        });
    }

    renderizaConteudo() {
        const listaId = `${this.type}-projects-list`;
        this.elemento.querySelector('ul')!.id = listaId;
        this.elemento.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderizarProjetos() {
        const listaElemento = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listaElemento.innerHTML = ''; // não duplica projetos na renderização
        for (const itensProjeto of this.projetosAtribuidos) {
            const listaItens = document.createElement('li');
            listaItens.textContent = itensProjeto.titulo;
            listaElemento?.appendChild(listaItens);
        }
    }
}


// Classe ProjetoEntrada
class ProjetoEntrada extends Componente<HTMLDivElement, HTMLFormElement> {
    elementoTituloEntrada: HTMLInputElement;
    elementoDescricaoEntrada: HTMLInputElement;
    elementoPessoasEntrada: HTMLInputElement;
    
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.elementoTituloEntrada = this.elemento.querySelector('#title') as HTMLInputElement;
        this.elementoDescricaoEntrada = this.elemento.querySelector('#description') as HTMLInputElement;
        this.elementoPessoasEntrada = this.elemento.querySelector('#people') as HTMLInputElement;

        this.configure(); 
    }

    configure() {
        this.elemento.addEventListener('submit', this.controladorEnvio);
    }

    renderizaConteudo() {
        
    }

    private juntaEntradaUsuario(): [string, string, number] | void {
        const tituloEntrada = this.elementoTituloEntrada.value;
        const descricaoEntrada = this.elementoDescricaoEntrada.value;
        const pessoasEntrada = this.elementoPessoasEntrada.value;

        const tituloValidavel: Validavel = {
            valor: tituloEntrada,
            requerido: true
        };
        const descricaoValidavel: Validavel = {
            valor: descricaoEntrada,
            requerido: true,
            minTamanho: 5
        };
        const pessoasValidavel: Validavel = {
            valor: +pessoasEntrada,
            requerido: true,
            min: 1,
            max: 5
        };

        if (
            !valida(tituloValidavel) ||
            !valida(descricaoValidavel) ||
            !valida(pessoasValidavel)
            ) {
                alert('Entrada inválida, tente novamente!');
                return;
        } else {
            return [tituloEntrada, descricaoEntrada, +pessoasEntrada];
        }
    }

    private limpaEntradas() {
        this.elementoTituloEntrada.value = '';
        this.elementoDescricaoEntrada.value = '';
        this.elementoPessoasEntrada.value = '';
    }

    @autobind //tsconfig => experimentalDecorators: true
    private controladorEnvio(event: Event) {
        event.preventDefault();
        const entradaUsuario = this.juntaEntradaUsuario();
        if (Array.isArray(entradaUsuario)) {
            const [titulo, desc, pessoas] = entradaUsuario;
            estadoProjeto.adicionaProjeto(titulo, desc, pessoas);
            this.limpaEntradas();
        }
    }
}

const pjtEntrada = new ProjetoEntrada();
const listaProjetoAtivo = new ProjetoLista('active');
const listaProjetoFinalizado = new ProjetoLista('finished');