/// <reference path="arrasta-solta-interfaces.ts" />
/// <reference path="projeto-modelo.ts" />

namespace App {
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
            this.atualizaOuvintes();
        }
    
        moveProjeto(projetoId: string, novoStatus: StatusProjeto) {
            const projeto = this.projetos.find(pjt => pjt.id === projetoId);
            if (projeto && projeto.status !== novoStatus) {
                projeto.status = novoStatus;
                this.atualizaOuvintes();
            }
        }
    
        private atualizaOuvintes() {
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
            ehValido = ehValido && entradaValidavel.valor >= entradaValidavel.min;
        }
        if (entradaValidavel.max != null && typeof entradaValidavel.valor === 'number') {
            ehValido = ehValido && entradaValidavel.valor <= entradaValidavel.max;
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
    
    //Classe ProjetoItem
    class ProjetoItem extends Componente<HTMLUListElement, HTMLLIElement> implements Arrastavel {
        private projeto: Projeto;
    
        get pessoas() {
            if (this.projeto.pessoas === 1) {
                return '1 pessoa atribuída';
            } else {
                return `${this.projeto.pessoas} pessoas atribuídas`;
            }
        }
        
        constructor(hostId: string, projeto: Projeto) {
            super('single-project', hostId, false, projeto.id);
            this.projeto = projeto;
    
            this.configure();
            this.renderizaConteudo();
        }
    
        @autobind
        arrastaInicio(event: DragEvent) {
            event.dataTransfer!.setData('text/plain', this.projeto.id);
            event.dataTransfer!.effectAllowed = 'move';
        }
    
        arrastaFim(_: DragEvent) {
            console.log('ArrastaFim');
        }
    
        configure() {
            this.elemento.addEventListener('dragstart', this.arrastaInicio);
            this.elemento.addEventListener('dragend', this.arrastaFim);
        }
    
        renderizaConteudo() {
            this.elemento.querySelector('h2')!.textContent = this.projeto.titulo;
            this.elemento.querySelector('h3')!.textContent = this.pessoas;
            this.elemento.querySelector('p')!.textContent = this.projeto.descricao;
    
        }
    }
    
    // Classe ProjetoLista
    class ProjetoLista extends Componente<HTMLDivElement, HTMLElement> implements AlvoArrasta {
        projetosAtribuidos: Projeto[];
    
        constructor(private type: 'active' | 'finished') {
            super('project-list', 'app', false,`${type}-projects`);
            this.projetosAtribuidos = [];
    
            this.configure();
            this.renderizaConteudo();
        }
    
        @autobind
        arrastaSobre(event: DragEvent) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listaElemento = this.elemento.querySelector('ul')!;
                listaElemento.classList.add('droppable');
            }
        }
    
        @autobind
        solta(event: DragEvent) {
            const projetoId = event.dataTransfer!.getData('text/plain');
            estadoProjeto.moveProjeto(projetoId, this.type === 'active' ? StatusProjeto.Active : StatusProjeto.Finished);
        }
    
        @autobind
        arrastaDesiste(_: DragEvent) {
            const listaElemento = this.elemento.querySelector('ul')!;
            listaElemento.classList.remove('droppable');
        }
    
        configure() {
            this.elemento.addEventListener('dragover', this.arrastaSobre);
            this.elemento.addEventListener('dragleave', this.arrastaDesiste);
            this.elemento.addEventListener('drop', this.solta);
    
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
                new ProjetoItem(this.elemento.querySelector('ul')!.id, itensProjeto);
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
    
    new ProjetoEntrada();
    new ProjetoLista('active');
    new ProjetoLista('finished');
}