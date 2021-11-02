import { AddDragonHandler } from "./addDragon.command";
import { CreateOrderHandler } from "./createOrder.command";
import { DeleteDragonCommand } from "./deleteDragon.command";
import { ReportAboutOrderHandler } from "./ReportAboutOrder.command";
import { UpdateDragonHandler } from "./updateDragon.command";
import {UpdateOrderHandler} from './updateOrder.command';

export const CommandHandlers =[UpdateOrderHandler, ReportAboutOrderHandler,AddDragonHandler,DeleteDragonCommand,UpdateDragonHandler,CreateOrderHandler];

