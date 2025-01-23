export class User {
    firstName: string;
    lastName: string;
    birthDate: number;
    street: string;
    streetnumber: string;
    zipCode: string;
    city: string;
    email: string;

    constructor(obj?: any) {
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.birthDate = obj ? obj.birthDate : 0;
        this.street = obj ? obj.street : '';
        this.streetnumber = obj ? obj.streetnumber : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
        this.email = obj ? obj.email : '';
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
            email: this.email
        };
    }
}
