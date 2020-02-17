import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalhesCPage } from './detalhes-c';

@NgModule({
  declarations: [
    DetalhesCPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalhesCPage),
  ],
})
export class DetalhesCPageModule {}
