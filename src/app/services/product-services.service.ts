import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {

  private url = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) { }

  getProducts():Observable<any>{
    return this.http.get<any>(this.url)
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/verification/${id}`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, product);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.url, product);
  }
}
