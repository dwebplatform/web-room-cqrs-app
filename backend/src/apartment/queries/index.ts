import { GetAllApartmentHandler } from "./getAllApartments";
import { GetApartmentByIdHandler } from "./getApartmentById";
import { ListApartmentHadler } from "./ListApartment";



export const QueryHandlers = [ListApartmentHadler,GetApartmentByIdHandler,GetAllApartmentHandler];