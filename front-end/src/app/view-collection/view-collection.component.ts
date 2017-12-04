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
  job: any;
  user: object;
  collection: object;
  images: object;
  authorized: boolean;
  constructor(private viewCollectionService: ViewCollectionService, private dashboardService: DashboardService, private router:Router) {
    this.job = [];
    this.user = null;
    this.collection = null;
    this.images = [[],[],[],[]];
    this.authorized = false;
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

  likeCollection(event){
    event.preventDefault();

    this.viewCollectionService.likeCollection(this.getCookie("token"), this.collection['_id']).subscribe(
      data=>{
        console.log(data);
        if(data['message']=="Upvote successful"){
          this.collection['rating']++;
        }
      },
      err=>{
        console.log(err);
      }
    );
  }

  ngOnInit() {
    this.job.push(0);this.job.push(2);
    let token = this.getCookie('token')||"";
    let collection_id = this.router.url.split('/')[2];

    this.dashboardService.getUserData(token).subscribe(
      data => {
            this.user=data;
            this.authorized = true;
            this.job[0]++;
      },
      err => {
            this.job[0]++;
            this.authorized = false;
            console.log("err", err);
        }
    );

    this.viewCollectionService.getCollection(token, collection_id).subscribe(
      data=>{
        this.collection = data;
        for(let i = 0; i < this.collection['image_id'].length; i++){
          this.images[Math.floor(i/4)][i%4]=this.collection['image_id'][i];
        }

        this.job[0]++;
      },
      err=>{
        console.log(err);
        this.job[0]++;
      }
    );
  }

  removeCollection(event){
    event.preventDefault();

    this.viewCollectionService.removeCollection(this.getCookie("token"), this.collection['_id']).subscribe(
      data=>{
        this.router.navigate([`/${this.user._id}/dashboard`]);
      },
      err=>{
        console.log(err);
      }
    );
  }

}
