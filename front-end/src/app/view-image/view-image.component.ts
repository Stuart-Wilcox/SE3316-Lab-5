import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { ViewImageService } from '../view-image.service';
import { ViewCollectionService } from '../view-collection.service';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css'],
  providers:[DashboardService, ViewImageService, ViewCollectionService]
})
export class ViewImageComponent implements OnInit {
  job:any;
  asset_id: string;
  user:object;
  nasa_object: object;//two components: asset and metadata
  collections: object;

  constructor(private dashboardService: DashboardService, private router:Router, private viewImageService:ViewImageService, private viewCollectionService:ViewCollectionService) {
    this.asset_id = this.router.url.split("/")[2];
    this.user = null;
    this.job = [];
    this.collections = null;
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
    this.job.push(0);this.job.push(4)//job=[0, 3];//the first is the number of complete jobs. The second is the number of jobs. When a job is done, increment the first number and compare it to the second
    let token = this.getCookie("token");

    //token only exists if logged in

    if(token){

      //get the user data
      this.dashboardService.getUserData(token).subscribe(
        data => {
            this.job[0]++;
            this.user=data;

            //populate the collections option at the bottom
            this.viewCollectionService.getUserCollections(token, this.user['_id']).subscribe(
              data=>{
                this.job[0]++;
                this.collections=data;
              },
              err=>{
                console.log(err);
              }
            );
        },
        err => {
              this.user={name:"An error occurred."};
              console.log("err", err);
          }
      );
    }
    else{
      //TODO: redirect to search
    }

    //make sure there is really an assetId

    if(this.asset_id){
      this.nasa_object = {};//object to hold the metadata and asset

      //get the asset
      this.viewImageService.getAsset(this.asset_id).subscribe(
        data=>{
          this.job[0]++;
          this.nasa_object['asset'] = data;
        },
        err=>{
          console.log(err);
        }
      );

      //get the metadata. This takes two steps since the first one only fetches to url to find the metadata at
      this.viewImageService.getMetadataUrl(this.asset_id).subscribe(
        data=>{

          //get the actual metadata
          this.viewImageService.getMetadata(data['location']).subscribe(
            data=>{
              this.job[0]++;
              this.nasa_object['metadata'] = data;
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
    }
    else{
      //the is no asset_id but that should never happen.
      //should redirect to somewhere
      console.log("Shouldnt be here");
    }
  }


  addToCollection(event, collectionId){
    event.preventDefault();

    if(collectionId=="null"){
      //null option
      return;
    }

    console.log(collectionId);
    console.log(this.nasa_object['asset'].collection.items[0].href);

    let image_id = this.nasa_object['asset'].collection.items[0].href;


    //add the image (url=image_id) to the collection (collectionId)
    this.viewCollectionService.addImageToCollection(this.getCookie("token"), collectionId, image_id).subscribe(
      data=>{
        //TODO: finish this
        console.log(data);
      },
      err=>{
        console.log(err);
      }
    );

  }

}
