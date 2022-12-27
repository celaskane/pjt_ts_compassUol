import { Projeto } from '../models/projeto.js'
import { Arrastavel } from '../models/arrasta-solta.js';
import { Componente } from './componente-base.js';
import { autobind } from '../decorators/autobind.js';

//Classe ProjetoItem
export class ProjetoItem extends Componente<HTMLUListElement, HTMLLIElement> implements Arrastavel {
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