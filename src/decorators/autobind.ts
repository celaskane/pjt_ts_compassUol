
// Autobind Decorator
export function autobind(
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
