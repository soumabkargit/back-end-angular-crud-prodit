import {Component, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {ProductModel, Product} from './modele/productModel';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from './services/product.service';
import {animate, state, style, transition, trigger} from '@angular/animations';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  title = 'produit-front';
  isChecked = false;
  isReadingOnly = true;
  isCorrect = false;
  columnsToDisplay: string[] = [ 'name', 'price', 'quantity', 'actions'];
  expandedElement: ProductModel | null;
  firstFormGroup: FormGroup;
  PRODUCT_DATA: ProductModel[];
  dataSource = null;
  productToAdd;
  productToUpdate;

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit(): void{
    this.firstFormGroup = this.formBuilder.group({
      nameProduct: ['', Validators.required],
      quantityProduct: ['', Validators.required],
      priceProduct: ['', Validators.required]
    });
    this.getAllProducts();
  }

  constructor( private formBuilder: FormBuilder, private produitService: ProductService){
  }

  getAllProducts(): void{
    this.produitService.getAllProducts().subscribe(
      {
     next: data => {
        this.PRODUCT_DATA = data;
      },
      error: err => {
         console.log('erreur interne');
      },
      complete: () => {this.dataSource = new MatTableDataSource(this.PRODUCT_DATA); }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  cheCkToggle(){
  if ( this.isChecked === false){
    this.isReadingOnly = false;
   }
    else{
    this.isReadingOnly = true;
  }
  }
  createProduct( ){

    if (this.firstFormGroup.valid){
      console.log(this.firstFormGroup.get('nameProduct').value);
      console.log(this.firstFormGroup.get('quantityProduct').value);
      console.log(this.firstFormGroup.get('priceProduct').value);
      this.isCorrect = false;
      this.productToAdd = new Product(this.firstFormGroup.get('nameProduct').value, this.firstFormGroup.get('quantityProduct').value
                                    , this.firstFormGroup.get('priceProduct').value);
      this.produitService.createNewProduct(this.productToAdd).subscribe({
        next: data => {
          console.log('OK');
          this.getAllProducts();
          this.accordion.openAll();
        },
        error : err => {
         console.log('KO');
         this.isCorrect = true;
        },
        complete: () => {
          console.log('terminer');
        }
      });
    }else{
      this.isCorrect = true;
    }
  }
  deleteProduct(selectedItem: any){
   this.produitService.deleteProduct(selectedItem.id).subscribe({
      next: data => {
        console.log('OK');
      },
      error: err => {
        console.log('KO');
      },
      complete : () => {
      this.getAllProducts();
      this.accordion.openAll();
      }
    });
  }
  updateProduct(selectedItem: any){
    this.productToUpdate = new Product(selectedItem.name, selectedItem.quantity
                                    , selectedItem.price);
    this.produitService.updateProduct(selectedItem.id, this.productToUpdate).subscribe({
        next: data => {
          this.getAllProducts();
          this.accordion.openAll();
          console.log('OK');
        },
        error : err => {
         console.log('KO');
         this.isCorrect = true;
        },
        complete: () => {
          console.log('terminer');
        }
      });
  }

}
