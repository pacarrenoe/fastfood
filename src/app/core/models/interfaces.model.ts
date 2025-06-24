export interface Producto {
  id?: string;
  nombre: string;
  precio: number;
  categoriaId: string;
  vigente: boolean;
}

export interface Categoria {
  id?: string;
  nombre: string;
}
