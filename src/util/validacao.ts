namespace App {
    // Lógica para Validação
    export interface Validavel {
        valor: string | number;
        requerido?: boolean;
        minTamanho?: number;
        maxTamanho?: number;
        min?: number;
        max?: number;
    }
    
    export function valida(entradaValidavel: Validavel) {
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
}