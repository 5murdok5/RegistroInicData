import { Component, OnInit } from "@angular/core";
import { Carrera } from "../../shared/carrera";
import { FirebaseService } from "../../services/firebase.service";
import { ActivatedRoute } from "@angular/router";
import { NavController, LoadingController } from "@ionic/angular";

@Component({
  selector: "app-details",
  templateUrl: "./details.page.html",
  styleUrls: ["./details.page.scss"],
})
export class DetailsPage implements OnInit {
  carrera: Carrera = {
    origen: "",
    destino: "",
  };

  carreraId = null;

  constructor(
    private route: ActivatedRoute,
    private nav: NavController,
    private fireServise: FirebaseService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    
    this.carreraId = this.route.snapshot.params['id'];
    if (this.carreraId){
      this.loadCarrera();
    }
  }

  async loadCarrera(){
    const loading = await this.loadingController.create({
      message: 'Loading....'
    });
    await loading.present();

    this.fireServise.getCarrera(this.carreraId).subscribe(carrera => {
      loading.dismiss();;
      this.carrera = carrera;
    });
  }
  async saveCarrera() {
    const loading = await this.loadingController.create({
      message: 'Saving....'
    });
    await loading.present();
 
    if (this.carreraId) {
      this.fireServise.updateCarrera(this.carrera, this.carreraId).then(() => {
        loading.dismiss();
        this.nav.navigateForward('/');
      });
    } else {
      this.fireServise.addCarrera(this.carrera).then(() => {
        loading.dismiss();
        this.nav.navigateForward('/');
      });
    }
  }
  async onRemoveCarrera(idCarrera:string) {
    this.fireServise.removeCarrera(idCarrera);
  }
}
