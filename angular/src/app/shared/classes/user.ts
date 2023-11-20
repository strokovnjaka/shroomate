export class User {
  _id!: string;
  admin: boolean;
  location_friends: string;
  location_everyone: string;
  friends: string[];
  name: string;
  email: string;
  password?: string;

  constructor(name?: string, email?: string) {
    this.name = name === undefined ? '' : name;
    this.email = email === undefined ? '' : email;
    this.admin = false;
    this.location_friends = 'macro';
    this.location_everyone = 'region';
    this.friends = [];
  }
}
