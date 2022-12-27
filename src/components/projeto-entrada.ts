/// <reference path="componente-base.ts" />

namespace App {
    // Classe ProjetoEntrada
    export class ProjetoEntrada extends Componente<HTMLDivElement, HTMLFormElement> {
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
}