import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
}));

describe('UserService', () => {
  let service: UsersService;
  let repositoryMock: MockType<Repository<User>>;
  const fakeUser = {
    id: '1',
    email: 'fake@user.test',
    password: '123',
    roles: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  describe('Find user by id', () => {
    it('should find a user in the repository', async () => {
      repositoryMock.findOne.mockReturnValue(fakeUser);

      const results = await service.findOne(fakeUser.id);
      expect(repositoryMock.findOne).toHaveBeenCalled();
      expect(results).toEqual(fakeUser);
    });
  });

  describe('Find user by email', () => {
    it('should find a user in the repository', async () => {
      repositoryMock.findOne.mockReturnValue(fakeUser);

      const results = await service.findOneByEmail(fakeUser.email);
      expect(repositoryMock.findOne).toHaveBeenCalled();
      expect(results).toEqual(fakeUser);
    });
  });

  describe('Find if user in the groups array', () => {
    it('should find a user in the groups arry', async () => {
      repositoryMock.findOne.mockReturnValue(fakeUser);

      const results = await service.findOneByEmail(fakeUser.email);
      expect(repositoryMock.findOne).toHaveBeenCalled();
      expect(results).toEqual(fakeUser);
    });
  });
});
