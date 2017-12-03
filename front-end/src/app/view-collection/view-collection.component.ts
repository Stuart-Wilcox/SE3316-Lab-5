import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { ViewCollectionService } from '../view-collection.service';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.css'],
  providers: [ViewCollectionService, DashboardService]
})
export class ViewCollectionComponent implements OnInit {
  loading: boolean;
  user: object;
  collection: object;
  images: object;
  constructor(private viewCollectionService: ViewCollectionService, private dashboardService: DashboardService, private router:Router) {
    this.loading = true;
    this.user = null;
    this.collection = null;
    this.images = [[],[],[],[]];
  }

  getCookie(cname) {/* referenced from stack overflow https://stackoverflow.com/questions/10730362/get-cookie-by-name*/
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }

  ngOnInit() {
    let token = this.getCookie('token')||"";
    let collection_id = this.router.url.split('/')[2];

    this.dashboardService.getUserData(token).subscribe(
      data => {
            this.user=data;
      },
      err => {
            this.user={name:"An error occurred."};
            console.log("err", err);
        }
    );

    this.viewCollectionService.getCollection(token, collection_id).subscribe(
      data=>{
        console.log(data);
        this.collection = data;
        for(let i = 0; i < this.collection['image_id'].length; i++){
          this.images[Math.floor(i/4)][i%4]=this.collection['image_id'][i];
        }

        console.log(this.images);
        this.loading = false;
      },
      err=>{
        console.log(err);
      }
    );
  }

}
