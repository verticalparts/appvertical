import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderConfirmationCPage } from './order-confirmation-c';
import { PedidoCService } from '../../services/domain/pedido-c.service';

@NgModule({
  declarations: [
    OrderConfirmationCPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderConfirmationCPage),
  ],
  providers: [
    PedidoCService
  ]
})
export class OrderConfirmationCPageModule {}
