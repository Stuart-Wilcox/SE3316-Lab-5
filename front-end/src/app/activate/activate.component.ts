import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivateService } from "../activate.service";

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css'],
  providers: [ActivateService]
})
export class ActivateComponent implements OnInit {
  loading: boolean;
  activated: boolean;
  constructor(private activateService: ActivateService, private router: Router) {
    this.loading = true;
    this.activated = null;
  }

  ngOnInit() {
    let id = this.router.url.split('/')[3];
    this.activateService.activate(id).subscribe(
      data =>{
        this.loading = false;
        console.log(data);
        if(data['message']=="already unlocked"){
          this.activated = false;
        }else{
          this.activated = true;
        }
      },
      err =>{
        this.loading=false;
        console.log(err);
      }
    )
  }

}
