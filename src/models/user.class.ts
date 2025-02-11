export class User {
    id?: string;
    firstName: string;
    lastName: string;
    birthDate: number;
    street: string;
    streetnumber: string;
    zipCode: string;
    city: string;
    email: string;
    phone: string; // Neue Eigenschaft für die Telefonnummer
  
    constructor(obj?: Partial<User>) {
      this.id = obj?.id;
      this.firstName = obj?.firstName || '';
      this.lastName = obj?.lastName || '';
      this.birthDate = obj?.birthDate || 0;
      this.street = obj?.street || '';
      this.streetnumber = obj?.streetnumber || '';
      this.zipCode = obj?.zipCode || '';
      this.city = obj?.city || '';
      this.email = obj?.email || '';
      this.phone = obj?.phone || ''; // Standardwert: leerer String
    }
  
    public toJSON() {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate,
        street: this.street,
        streetnumber: this.streetnumber,
        zipCode: this.zipCode,
        city: this.city,
        email: this.email,
        phone: this.phone // In das JSON wird auch die Telefonnummer übernommen
      };
    }
  }