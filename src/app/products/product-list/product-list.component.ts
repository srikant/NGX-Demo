import { Component, OnInit, OnDestroy } from '@angular/core';

// import { Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import * as fromProduct from '../state/product.reducer';

import { Store, select } from '@ngrx/store';
import * as productActions from '../state/product.action';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage: string;

  displayCode: boolean;

  products: Product[];

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;
  // sub: Subscription;

  constructor(private store: Store<fromProduct.State>,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.store.pipe(select(fromProduct.getCurrentProduct)).subscribe(
      currentProduct => this.selectedProduct = currentProduct
    );
    // this.sub = this.productService.selectedProductChanges$.subscribe(
    //   selectedProduct => this.selectedProduct = selectedProduct
    // );

    this.productService.getProducts().subscribe(
      (products: Product[]) => this.products = products,
      (err: any) => this.errorMessage = err.error
    );

    this.store.pipe(select(fromProduct.getShowProductCode)).subscribe(
      showProductCode => this.displayCode = showProductCode
    );
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new productActions.ToggleProductCode(value));
    // this.displayCode = value;
  }

  newProduct(): void {
    this.store.dispatch(new productActions.InitializeCurrentProduct());
    // this.productService.changeSelectedProduct(this.productService.newProduct());
  }

  productSelected(product: Product): void {
    this.store.dispatch(new productActions.SetCurrentProduct(product));
    // this.productService.changeSelectedProduct(product);
  }

}
