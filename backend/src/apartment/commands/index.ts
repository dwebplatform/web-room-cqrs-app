import { AddImagesToApartmentHandler } from "./addImagesToApartment";
import { ChangeApartmentNameHandler } from "./changeApartmentName.command";
import { CreateApartmentHandler } from "./createApartment.command";
import { UpdateApartmentNameHandler } from "./updateApartment.command";


export const CommandHandlers=[AddImagesToApartmentHandler,CreateApartmentHandler,UpdateApartmentNameHandler,ChangeApartmentNameHandler];