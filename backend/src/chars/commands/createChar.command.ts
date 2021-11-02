import { CommandHandler, EventPublisher, IQueryHandler } from '@nestjs/cqrs';
import { Order } from "../../entities/order.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CHAR_VARIANTS, CreateCharDto } from '../dtos/create-char.dto';
import { Characteristic, KEY_VARIANTS } from 'src/entities/char.entity';
import { CharAggregate } from '../events/CharCreatedEvent';



export class CreateCharCommand {

  constructor(public readonly createCharDto: CreateCharDto){}
}


@CommandHandler(CreateCharCommand)
export class CreateCharHandler implements IQueryHandler<CreateCharCommand>{
  
  constructor(@InjectRepository(Characteristic) private readonly _charRepo: Repository<Characteristic>,
    private publisher: EventPublisher
  ){}
  
  public async execute(request:CreateCharCommand,):Promise<any>{
    const { charValue, charVariant, keyName, apartmentId } = request.createCharDto;
    const char = new Characteristic();
    char.keyName = keyName;
    // console.log({charValue, charVariant, keyName, apartmentId});
    if(charVariant === CHAR_VARIANTS.BOOL_VALUE && typeof charValue === 'boolean'){
      char.BOOL_VALUE = charValue;
      char.valueType = KEY_VARIANTS.BOOL;
    }
    if(charVariant === CHAR_VARIANTS.ARRAY_VALUE && Array.isArray(charValue)){
      char.ARRAY_VALUE = charValue;
      char.valueType = KEY_VARIANTS.ARRAY;
    }
    if(charVariant === CHAR_VARIANTS.STRING_VALUE && typeof charValue === 'string'){
      char.STRING_VALUE = charValue;
      char.valueType = KEY_VARIANTS.STRING;
    }

    const savedChar =  await this._charRepo.save(char);
    console.log(savedChar)
    if(apartmentId){
      const charAggregator = this.publisher.mergeObjectContext(new CharAggregate(savedChar.id));
      charAggregator.addApartmentToChar(apartmentId);
      charAggregator.commit();
    }
    return savedChar;
  }
}
