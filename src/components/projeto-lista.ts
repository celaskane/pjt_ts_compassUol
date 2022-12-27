/// <reference path="componente-base.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../state/projeto-estado.ts" />
/// <reference path="../models/projeto.ts" />
/// <reference path="../models/arrasta-solta.ts" />

namespace App {
    // Classe ProjetoLista
    export class ProjetoLista extends Componente<HTMLDivElement, HTMLElement> implements AlvoArrasta {
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
}