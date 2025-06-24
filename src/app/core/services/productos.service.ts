import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  writeBatch,
  query
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categoria, Producto } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productosCache: Producto[] = [];
  private categoriasCache: Categoria[] = [];
  private productosEliminados: string[] = [];
  private categoriasEliminadas: string[] = [];

  constructor(private firestore: Firestore) {}

  // -------------------- CATEGORÍAS --------------------

  obtenerCategorias(): Observable<Categoria[]> {
    const ref = collection(this.firestore, 'categorias');
    const q = query(ref); // 🔥 importante para evitar el error de tipo
    return collectionData(q, { idField: 'id' }) as Observable<Categoria[]>;
  }

  agregarCategoria(cat: Categoria): void {
    const id = this.generarId();
    this.categoriasCache.push({ id, nombre: cat.nombre });
  }

  editarCategoria(cat: Categoria): void {
    const idx = this.categoriasCache.findIndex(c => c.id === cat.id);
    if (idx !== -1) this.categoriasCache[idx] = cat;
  }

  eliminarCategoria(cat: Categoria): void {
    if (cat.id) {
      this.categoriasEliminadas.push(cat.id);
      this.categoriasCache = this.categoriasCache.filter(c => c.id !== cat.id);
      this.productosCache = this.productosCache.filter(p => p.categoriaId !== cat.nombre);
    }
  }

  // -------------------- PRODUCTOS --------------------

  obtenerProductos(): Observable<Producto[]> {
    const ref = collection(this.firestore, 'productos');
    const q = query(ref);
    return collectionData(q, { idField: 'id' }).pipe(
      map(productos => {
        this.productosCache = productos as Producto[];
        return this.productosCache;
      })
    );
  }

  agregarProducto(prod: Producto): void {
    const nuevo: Producto = { ...prod, id: this.generarId(), vigente: true };
    this.productosCache.push(nuevo);
  }

  editarProducto(prod: Producto): void {
    const idx = this.productosCache.findIndex(p => p.id === prod.id);
    if (idx !== -1) this.productosCache[idx] = prod;
  }

  eliminarProducto(prod: Producto): void {
    if (prod.id) {
      this.productosEliminados.push(prod.id);
      this.productosCache = this.productosCache.filter(p => p.id !== prod.id);
    }
  }

  cambiarVigencia(id: string): void {
    const prod = this.productosCache.find(p => p.id === id);
    if (prod) prod.vigente = !prod.vigente;
  }

  // -------------------- GUARDAR CAMBIOS --------------------

  async guardarCambios(): Promise<void> {
    const batch = writeBatch(this.firestore);

    for (const prod of this.productosCache) {
      const ref = doc(this.firestore, 'productos', prod.id!);
      batch.set(ref, prod);
    }

    for (const id of this.productosEliminados) {
      const ref = doc(this.firestore, 'productos', id);
      batch.delete(ref);
    }

    for (const cat of this.categoriasCache) {
      const ref = doc(this.firestore, 'categorias', cat.id!);
      batch.set(ref, { nombre: cat.nombre });
    }

    for (const id of this.categoriasEliminadas) {
      const ref = doc(this.firestore, 'categorias', id);
      batch.delete(ref);
    }

    await batch.commit();

    this.productosEliminados = [];
    this.categoriasEliminadas = [];

    sessionStorage.setItem('productos', JSON.stringify(this.productosCache));
    sessionStorage.setItem('categorias', JSON.stringify(this.categoriasCache));
  }

  // -------------------- UTILIDADES --------------------

  getProductosLocales(): Producto[] {
    return [...this.productosCache];
  }

  getCategoriasLocales(): Categoria[] {
    return [...this.categoriasCache];
  }

  public generarId(): string {
    return doc(collection(this.firestore, '_')).id;
  }
}
