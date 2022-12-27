namespace App {
    // Classe Base Componente
    export abstract class Componente<T extends HTMLElement, U extends HTMLElement> {
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
}