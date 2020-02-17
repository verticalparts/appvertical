import { RefDTO } from "./ref.dto";
import { ItemPedidoCDTO } from "./item-pedidoC.dto";

export interface PedidoCDTO {
    cliente: RefDTO;
    enderecoDeEntrega: RefDTO;
    itens: ItemPedidoCDTO[];
}