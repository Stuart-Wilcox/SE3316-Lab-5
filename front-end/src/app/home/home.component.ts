import { Component, OnInit } from '@angular/core';
import { ViewCollectionService } from '../view-collection.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ViewCollectionService]
})
export class HomeComponent implements OnInit {
  collections: object;
  constructor(private viewCollectionService: ViewCollectionService) {
    this.collections = null;
  }

  ngOnInit() {
    this.viewCollectionService.getTopCollections().subscribe(
      data=>{
        console.log(data);
        this.collections = data;
      }, err=>{
        console.log(err);
      }
    );
  }

}
