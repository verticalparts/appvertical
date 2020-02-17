import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriasCPage } from './categorias-c';

@NgModule({
  declarations: [
    CategoriasCPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoriasCPage),
  ],
})
export class CategoriasCPageModule {}
