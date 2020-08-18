export interface ProductModel {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export class Product{
    // tslint:disable-next-line: ban-types
    constructor(public name: string , public price: number, public quantity: string){
    }
    }
