import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as mocksHttp from 'node-mocks-http';

import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create.user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let spyService: UsersService;
  let requestMock: any;
  const fakeUser: CreateUserDto = {
    email: 'fake@user.test',
    password: '123',
    roles: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            list: jest.fn(() => []),
            listByGroups: jest.fn(() => []),
            create: jest.fn(() => ({})),
            delete: jest.fn(() => ({})),
          }),
        },
        {
          provide: 'REQUEST',
          useValue: mocksHttp.createRequest({
            user: {
              isGlobalManager: true,
            },
          }),
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    spyService = module.get<UsersService>(UsersService);
    requestMock = module.get(REQUEST);
  });

  describe('List', () => {
    it('should call list for the globalManager', async () => {
      requestMock.user.isGlobalManager = true;
      usersController.list();
      expect(spyService.list).toHaveBeenCalled();
    });
  });

  describe('List by group', () => {
    it('should call listByGroups for the none globalManager', async () => {
      requestMock.user.isGlobalManager = false;
      requestMock.user = { user: { id: 1 }, managedGroups: [] };

      usersController.list();
      expect(spyService.listByGroups).toBeCalledWith(
        requestMock.user.user.id,
        requestMock.user.managedGroups,
      );
    });
  });

  describe('Create user', () => {
    it('should call create', async () => {
      usersController.create(fakeUser);
      expect(spyService.create).toBeCalledWith(fakeUser);
    });
  });

  describe('Delete user', () => {
    it('should call delete', async () => {
      usersController.deleteOne(fakeUser);
      expect(spyService.delete).toBeCalledWith(fakeUser);
    });
  });
});
