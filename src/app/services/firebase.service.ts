import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { Carrera } from "../shared/carrera";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {

  private carreraCollection: AngularFirestoreCollection<Carrera>;
  private carreras: Observable<Carrera[]>;


  constructor(public db: AngularFirestore) {
    let currentUser = firebase.auth().currentUser;
    this.carreraCollection = db.collection('users').doc(currentUser.uid).collection<Carrera>('carreras');
    this.carreras = this.carreraCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCarreras(){
    return this.carreras;
  }

  getCarrera(id: string){
    return this.carreraCollection.doc<Carrera>(id).valueChanges();
  }

  updateCarrera(carrera:Carrera, id: string){
    return this.carreraCollection.doc(id).update(carrera);
  }
  
  addCarrera(carrera: Carrera){
    return this.carreraCollection.add(carrera);
  }
  
  removeCarrera(id: string){
    return this.carreraCollection.doc(id).delete();
  }
  
}
