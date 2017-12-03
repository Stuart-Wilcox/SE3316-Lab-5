import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { ViewImageService } from '../view-image.service';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css'],
  providers:[DashboardService, ViewImageService]
})
export class ViewImageComponent implements OnInit {
  loading:boolean;
  asset_id: string;
  user:object;
  nasa_object: object;//two components: asset and metadata

  constructor(private dashboardService: DashboardService, private router:Router, private viewImageService:ViewImageService) {
    this.asset_id = this.router.url.split("/")[2];
    this.loading = true;
    this.user = null;
  }

  getCookie(cname) {
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
    let job1=true, job2=true, job3=true;
    let token = this.getCookie("token");

    if(token){
      this.dashboardService.getUserData(token).subscribe(
        data => {
            job1=false;
            this.loading = job1||job2||job3;
            this.user=data;
        },
        err => {
          this.loading=false;
              this.user={name:"An error occurred."};
              console.log("err", err);
          }
      );
    }
    else{
      this.user={name:"Guest"};
      job1=false;
      this.loading = job1||job2||job3;
    }

    if(this.asset_id){
      this.nasa_object = {};
      this.viewImageService.getAsset(this.asset_id).subscribe(
        data=>{
          job2=false;
          this.loading = job1||job2||job3;
          console.log(data);
          this.nasa_object.asset = data;
        },
        err=>{
          console.log(err);
          job2=false;
          this.loading = job1||job2||job3;
        }
      );
      let metaDataUrl = "";
      this.viewImageService.getMetadataUrl(this.asset_id).subscribe(
        data=>{
          metaDataUrl = data['location'];
          this.viewImageService.getMetadata(metaDataUrl).subscribe(
            data=>{
              job3=false;
              this.loading = job1||job2||job3;
              console.log(data);
              this.nasa_object.metadata = data;
            },
            err=>{
              console.log(err);
            }
          );
        },
        err=>{
          console.log(err);
        }
      );
    }else{
      console.log("Shouldnt be here")
    }


  }

}
