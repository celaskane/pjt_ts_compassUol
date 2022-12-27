import { Projeto, StatusProjeto } from "../models/projeto.js";

// Gerenciamento de Estado do Projeto
type Ouvinte<T> = (itens: T[]) => void;
    
class Estado<T> {
    protected ouvintes: Ouvinte<T>[] = [];  //protected permite acesso de classes herdeiras

    adicionaOuvinte(ouvinteFn: Ouvinte<T>) {
        this.ouvintes.push(ouvinteFn);
    }
}

export class EstadoProjeto extends Estado<Projeto> {
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

export const estadoProjeto = EstadoProjeto.getInstance();
