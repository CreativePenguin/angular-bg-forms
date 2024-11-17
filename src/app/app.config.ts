import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideAnimationsAsync(), provideHttpClient(), provideFirebaseApp(() => initializeApp({"projectId":"test-00-c77de","appId":"1:864287131419:web:4b60183cca62591db7b5be","storageBucket":"test-00-c77de.firebasestorage.app","apiKey":"AIzaSyDP4kd1doMBPfOSirbE7I6DYLjMbbNbTAY","authDomain":"test-00-c77de.firebaseapp.com","messagingSenderId":"864287131419"})), provideAuth(() => getAuth()), provideFirebaseApp(() => initializeApp({"projectId":"test-00-c77de","appId":"1:864287131419:web:4b60183cca62591db7b5be","storageBucket":"test-00-c77de.firebasestorage.app","apiKey":"AIzaSyDP4kd1doMBPfOSirbE7I6DYLjMbbNbTAY","authDomain":"test-00-c77de.firebaseapp.com","messagingSenderId":"864287131419"})), provideAuth(() => getAuth())
  ]
};
