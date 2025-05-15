import { User } from './user.model';

describe('User model', () => {
  it('should create a User with default values', () => {
    const user = new User();
    expect(user.user_id).toBeNull();
    expect(user.mail).toBe('');
    expect(user.prenom).toBe('');
    expect(user.nom).toBe('');
    expect(user.telephone).toBe('');
    expect(user.role).toEqual(['user']);
  });

  it('should assign values from JSON correctly', () => {
    const json = {
      user_id: 7,
      email: 'test@test.com',
      firstName: 'Jean',
      lastName: 'Martin',
      phone: '0601020304',
      role: ['admin']
    };
    const user = new User();
    user.loadfromJson(json);
    expect(user.user_id).toBe(7);
    expect(user.role).toContain('admin');
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
    expect(user.role).toEqual(['user']);
  });
});