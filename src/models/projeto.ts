// Type Projeto
export enum StatusProjeto { 
    Active, 
    Finished
}

export class Projeto {
    constructor(
        public id: string, 
        public titulo: string, 
        public descricao: string, 
        public pessoas: number, 
        public status: StatusProjeto
        ) {

    }
}
