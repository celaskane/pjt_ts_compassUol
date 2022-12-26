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

    @autobind //tsconfig => experimentalDecorators: true
    private controladorEnvio(event: Event) {
        event.preventDefault();
        console.log(this.elementoTituloEntrada.value);
    }

    private configure() {
        this.elemento.addEventListener('submit', this.controladorEnvio);
    }
    
    private anexo() {
        this.elementoHost.insertAdjacentElement('afterbegin', this.elemento);
    }
}

const pjtEntrada = new ProjetoEntrada();