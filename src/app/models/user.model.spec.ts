import { User } from './user.model';

describe('User model', () => {
  it('should create a User with default values', () => {
    const user = new User();
    expect(user.user_id).toBeNull();
    expect(user.email).toBe('');
    expect(user.firstName).toBe('');
    expect(user.lastName).toBe('');
    expect(user.phone).toBe('');
    expect(user.role_names).toEqual(['user']);
  });

  it('should assign values from JSON correctly', () => {
    const json = {
      user_id: 7,
      email: 'test@test.com',
      firstName: 'Jean',
      lastName: 'Martin',
      phone: '0601020304',
      role_names: ['admin']
    };
    const user = new User();
    user.loadfromJson(json);
    expect(user.user_id).toBe(7);
    expect(user.role_names).toContain('admin');
  });

  it('should preserve default roles if none provided in JSON', () => {
    const json = {
      email: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      phone: '01020304'
    };
    const user = new User();
    user.loadfromJson(json);
    expect(user.role_names).toEqual(['user']);
  });
});
