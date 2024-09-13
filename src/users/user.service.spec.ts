import { Test } from '@nestjs/testing';
import { User } from './models/user.model';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  describe('findOrCreateFromRequest', () => {
    it('should return existing user if found', async () => {
      const authHeader = {
        masterPhrId: '123456789',
        mobileNumber: '555-555-5555',
        firstName: 'nikhil',
        lastName: 'katte',
      };

      const mockUser = {
        id: 1,
        username: authHeader.mobileNumber,
        name: `${authHeader.firstName} ${authHeader.lastName}`,
        user_registered: new Date(),
        meta: [{ meta_key: 'phr_id', meta_value: authHeader.masterPhrId }],
      };

      const createFromRequestSpy = jest.spyOn(service, 'createFromRequest');

      const queryMock = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(User, 'query').mockReturnValue({
        modify: jest.fn().mockReturnValue({ first: queryMock }),
      } as any);

      const result = await service.findOrCreateFromRequest(authHeader);

      expect(result).toEqual(mockUser);

      expect(createFromRequestSpy).not.toHaveBeenCalled();
    });

    it('should create new user if not found', async () => {
      const authHeader = {
        masterPhrId: '123456789',
        mobileNumber: '555-555-5555',
        firstName: 'Nikhil',
        lastName: 'katte',
      };

      const createFromRequestSpy = jest
        .spyOn(service, 'createFromRequest')
        .mockResolvedValue({} as any);

      jest.spyOn(User, 'query').mockReturnValue({
        modify: jest
          .fn()
          .mockReturnValue({ first: jest.fn().mockResolvedValue(null) }),
      } as any);

      const result = await service.findOrCreateFromRequest(authHeader);

      expect(createFromRequestSpy).toHaveBeenCalledWith(authHeader);

      expect(result).toEqual({} as any);
    });
  });
});
