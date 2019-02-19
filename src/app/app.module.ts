import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ErrorInterceptorProvider } from '../interceptors/error-interceptor';
import { AuthInterceptorProvider } from '../interceptors/auth-interceptor';

import { CategoriaService } from '../services/domain/categoria.service';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage_service';
import { ClienteService } from '../services/domain/cliente.service';
import { EstadoService } from '../services/domain/estado.service';
import { ProdutoService } from '../services/domain/produto.service';
import { CartService } from '../services/domain/cart.service';

import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { BrMaskerModule } from 'brmasker-ionic-3';

import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrMaskerModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CategoriaService,
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
    AuthService,
    StorageService,
    ClienteService,
    EstadoService,
    ProdutoService,
    CartService,
    File,
    FileOpener,
    DocumentViewer,
    FileTransfer,
    InAppBrowser,
    CallNumber
  ]
})
export class AppModule {}

