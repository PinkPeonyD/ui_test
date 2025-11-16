export default class TestDataGenerator {
  static firstNames = [
    'Daria',
    'Anna',
    'Maria',
    'Elena',
    'Olga',
    'Natalia',
    'Irina',
    'Svetlana',
    'Alexander',
    'Dmitry',
    'Sergey',
    'Andrey',
    'Ivan',
    'Mikhail',
    'Pavel',
    'Alexey',
    'John',
    'Jane',
    'Michael',
    'Sarah',
    'David',
    'Emma',
    'Robert',
    'Lisa',
  ];

  static lastNames = [
    'Shamraeva',
    'Ivanov',
    'Petrov',
    'Sidorov',
    'Kuznetsov',
    'Smirnov',
    'Popov',
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
  ];

  static genders = ['Male', 'Female', 'Other'];

  static emailDomains = ['example.com', 'test.com', 'mail.com', 'demo.org'];

  static getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateFirstName() {
    return this.getRandomElement(this.firstNames);
  }

  static generateLastName() {
    return this.getRandomElement(this.lastNames);
  }

  static generateEmail(firstName = null, lastName = null) {
    const first = firstName || this.generateFirstName();
    const last = lastName || this.generateLastName();
    const domain = this.getRandomElement(this.emailDomains);
    return `${first.toLowerCase()}.${last.toLowerCase()}@${domain}`;
  }

  static generateGender() {
    return this.getRandomElement(this.genders);
  }

  static generateMobile() {
    return String(this.getRandomNumber(1000000000, 9999999999));
  }

  static generateDateOfBirth() {
    const day = this.getRandomNumber(1, 28);
    const month = String(this.getRandomNumber(0, 11)); // 0-11 for select option
    const year = String(this.getRandomNumber(1950, 2005));
    return { day, month, year };
  }

  static generateAddress() {
    const streetNumber = this.getRandomNumber(1, 9999);
    const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln', 'Elm St', 'Park Ave'];
    const street = this.getRandomElement(streets);
    return `${streetNumber} ${street}`;
  }

  static generateSubjects() {
    const allSubjects = ['Maths', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Economics'];
    const count = this.getRandomNumber(1, 3);
    const shuffled = [...allSubjects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static generateHobbies() {
    const allHobbies = ['Sports', 'Reading', 'Music'];
    const count = this.getRandomNumber(1, 2);
    const shuffled = [...allHobbies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static generateCompleteFormData() {
    const firstName = this.generateFirstName();
    const lastName = this.generateLastName();
    const email = this.generateEmail(firstName, lastName);
    const gender = this.generateGender();
    const mobile = this.generateMobile();
    const dateOfBirth = this.generateDateOfBirth();
    const address = this.generateAddress();
    const subjects = this.generateSubjects();
    const hobbies = this.generateHobbies();

    return {
      firstName,
      lastName,
      email,
      gender,
      mobile,
      birthDay: dateOfBirth.day,
      birthMonth: dateOfBirth.month,
      birthYear: dateOfBirth.year,
      address,
      subjects,
      hobbies,
    };
  }

  static generateMinimalFormData() {
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      gender: this.generateGender(),
      mobile: this.generateMobile(),
    };
  }

  static generateTextBoxData() {
    const firstName = this.generateFirstName();
    const lastName = this.generateLastName();

    return {
      fullName: `${firstName} ${lastName}`,
      email: this.generateEmail(firstName, lastName),
      currentAddress: this.generateAddress(),
      permanentAddress: this.generateAddress(),
    };
  }
}
