import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { ActionSheetController } from '@ionic/angular';

import { Carrera } from '../shared/carrera';
import { FirebaseService } from '../services/firebase.service';
import { NavController, LoadingController } from "@ionic/angular";


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  carreras: Carrera[];

  constructor(
    private authservice : AuthService, 
    private actionSheetController: ActionSheetController,
    private FireServices : FirebaseService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.loadCarreras();
  }
  

  async loadCarreras(){
    const loading = await this.loadingController.create({
      message: 'Loading....'
    });
    await loading.present();

    this.FireServices.getCarreras().subscribe(carrera => {
      loading.dismiss();;
      this.carreras = carrera;
    });
  }

  Onlogout(){
    this.authservice.logout();
    this.carreras = [];
  }
  onRemove(idCarrera:string){
    this.FireServices.removeCarrera(idCarrera);
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Salir',
        role: 'destructive',
        icon: 'log-out',
        handler: () => {
          
          this.Onlogout()

        },
      }]
    });
    await actionSheet.present();
  }


}
