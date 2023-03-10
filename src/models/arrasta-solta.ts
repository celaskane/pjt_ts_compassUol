// Interfaces Arrasta & Solta (Drag & Drop)
export interface Arrastavel {
    arrastaInicio(event: DragEvent): void;
    arrastaFim(event: DragEvent): void;
}

export interface AlvoArrasta {
    arrastaSobre(event: DragEvent): void;
    solta(event: DragEvent): void;
    arrastaDesiste(event: DragEvent): void;
}
