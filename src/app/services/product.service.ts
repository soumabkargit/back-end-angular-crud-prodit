import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel} from '../modele/productModel';

const Baseurl = 'localhost/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor( private http: HttpClient ) { }

  getAllProducts(): Observable<ProductModel []> {

    return this.http.get<ProductModel[]>(Baseurl + 'products');
  }

  createNewProduct( productToAdd: ProductModel): Observable<ProductModel>{

    return this.http.post<ProductModel>(Baseurl + 'products', productToAdd, httpOptions);

  }
  deleteProduct(id: number): Observable<any>{
    return this.http.delete<any>(Baseurl + 'products/' + id);
  }
  updateProduct(id: number, productToUpdate: ProductModel): Observable<ProductModel>{
    return this.http.put<ProductModel>( Baseurl + 'products/' + id, productToUpdate, httpOptions);
  }
}
