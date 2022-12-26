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

// Classe ProjetoLista
class ProjetoLista {
    elementoTemplate: HTMLTemplateElement;
    elementoHost: HTMLDivElement;
    elemento: HTMLElement;

    constructor(private type: 'active' | 'finished') {
        this.elementoTemplate = document.getElementById('project-list')! as HTMLTemplateElement;
        this.elementoHost = document.getElementById('app')! as HTMLDivElement;
        const nodeImportado = document.importNode(this.elementoTemplate.content, true);
        this.elemento = nodeImportado.firstElementChild as HTMLElement;
        this.elemento.id = `${this.type}-projects`;
        this.anexo();
        this.renderizarConteudo();
    }

    private renderizarConteudo() {
        const listaId = `${this.type}-projects-list`;
        this.elemento.querySelector('ul')!.id = listaId;
        this.elemento.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private anexo() {
        this.elementoHost.insertAdjacentElement('beforeend', this.elemento);
    }
}


// Classe ProjetoEntrada
class ProjetoEntrada {
    elementoTemplate: HTMLTemplateElement;
    elementoHost: HTMLDivElement;
    elemento: HTMLFormElement;
    elementoTituloEntrada: HTMLInputElement;
    elementoDescricaoEntrada: HTMLInputElement;
    elementoPessoasEntrada: HTMLInputElement;
    
    constructor() {
        //importando componentes direto do index.html (devem ser declarados e tipados antes do constructor)
        this.elementoTemplate = document.getElementById('project-input')! as HTMLTemplateElement;
        this.elementoHost = document.getElementById('app')! as HTMLDivElement;
        //import node importa o conteudo
        const nodeImportado = document.importNode(this.elementoTemplate.content, true);
        this.elemento = nodeImportado.firstElementChild as HTMLFormElement;
        this.elemento.id = 'user-input';    //id do app.css

        this.elementoTituloEntrada = this.elemento.querySelector('#title') as HTMLInputElement;
        this.elementoDescricaoEntrada = this.elemento.querySelector('#description') as HTMLInputElement;
        this.elementoPessoasEntrada = this.elemento.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.anexo(); 
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
            console.log(titulo, desc, pessoas);
            this.limpaEntradas();
        }
    }

    private configure() {
        this.elemento.addEventListener('submit', this.controladorEnvio);
    }
    
    private anexo() {
        this.elementoHost.insertAdjacentElement('afterbegin', this.elemento);
    }
}

const pjtEntrada = new ProjetoEntrada();
const listaProjetoAtivo = new ProjetoLista('active');
const listaProjetoFinalizado = new ProjetoLista('finished');