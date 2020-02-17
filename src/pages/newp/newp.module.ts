import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewpPage } from './newp';

@NgModule({
  declarations: [
    NewpPage,
  ],
  imports: [
    IonicPageModule.forChild(NewpPage),
  ],
})
export class NewpPageModule {}
