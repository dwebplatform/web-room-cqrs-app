import { GetDragonByIdHandler } from "./getDragonById";
import { GetOrderByIdHandler } from "./getOrderById";
import { GetOrdersQueryHandler } from "./getOrders";
import { ListDragonHadler } from "./list.query";


export const QueriesHandlers = [GetDragonByIdHandler,ListDragonHadler,GetOrdersQueryHandler,GetOrderByIdHandler];