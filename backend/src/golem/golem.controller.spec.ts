import { Test, TestingModule } from '@nestjs/testing';
import { GolemController } from './golem.controller';

describe('GolemController', () => {
  let controller: GolemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GolemController],
    }).compile();

    controller = module.get<GolemController>(GolemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
