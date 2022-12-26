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

        if (
            tituloEntrada.trim().length === 0 || 
            descricaoEntrada.trim().length === 0 || 
            pessoasEntrada.trim().length === 0
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