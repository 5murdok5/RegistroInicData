import { Injectable , NgZone} from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "../shared/user";
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any;
  constructor(
    private AFauth: AngularFireAuth,
    public afStore: AngularFirestore,
    private router: Router,
    private db: AngularFirestore,
    public ngZone: NgZone 
  ) {
    this.AFauth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user"));
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });
  }

  login(email: string, password: string) {
    return new Promise((resolve, rejected) => {
      this.AFauth.auth
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          resolve(user);
        })
        .catch((err) => rejected(err));
    });
  }

  // Email verification when new user register
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  
  // Auth providers
  AuthLogin(provider) {
    return this.AFauth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['/home']);
        })
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.AFauth.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          "Password reset email has been sent, please check your inbox."
        );
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user.emailVerified !== false ? true : false;
  }

  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
 
  
  register(email: string, password: string, name: string) {
    return new Promise((resolve, reject) => {
      this.AFauth.auth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          // console.log(res.user.uid);
          const uid = res.user.uid;
          this.db.collection("users").doc(uid).set({
            name: name,
            uid: uid,
          });

          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  //cerrar sesion
  logout() {
    this.AFauth.auth.signOut().then(() => {
      this.router.navigate(["/login"]);
    });
  }
}
