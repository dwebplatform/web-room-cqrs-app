import { Test, TestingModule } from '@nestjs/testing';
import { CharsController } from './chars.controller';

describe('CharsController', () => {
  let controller: CharsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharsController],
    }).compile();

    controller = module.get<CharsController>(CharsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
