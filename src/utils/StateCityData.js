export class StateCityData {
  static STATE_CITY_MAP = {
    NCR: ['Delhi', 'Gurgaon', 'Noida'],
    'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
    Haryana: ['Karnal', 'Panipat'],
    Rajasthan: ['Jaipur', 'Jaiselmer'],
  };

  static getAllStates() {
    return Object.keys(this.STATE_CITY_MAP);
  }

  static getCitiesForState(state) {
    return this.STATE_CITY_MAP[state] || [];
  }

  static getRandomStateCity() {
    const states = this.getAllStates();
    const randomState = states[Math.floor(Math.random() * states.length)];
    const cities = this.getCitiesForState(randomState);
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    return {
      state: randomState,
      city: randomCity,
    };
  }

  static getFixedStateCity() {
    return {
      state: 'NCR',
      city: 'Delhi',
    };
  }

  static getAllStateCityCombinations() {
    const combinations = [];
    for (const [state, cities] of Object.entries(this.STATE_CITY_MAP)) {
      for (const city of cities) {
        combinations.push({ state, city });
      }
    }
    return combinations;
  }

  static isValidCombination(state, city) {
    const cities = this.getCitiesForState(state);
    return cities.includes(city);
  }

  static formatStateCityResult(state, city) {
    return `${state} ${city}`;
  }

  static generateAddressForStateCity(state, city) {
    const streetNumbers = ['1', '15', '23', '42', '88', '156', '234'];
    const streetTypes = ['Main St', 'Park Ave', 'Central Rd', 'Commercial St', 'Gandhi Nagar', 'MG Road'];

    const randomStreetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
    const randomStreetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];

    return `${randomStreetNumber} ${randomStreetType}, ${city}, ${state}`;
  }

  static getFixedStateCityWithAddress() {
    const stateCity = this.getFixedStateCity();
    return {
      ...stateCity,
      address: this.generateAddressForStateCity(stateCity.state, stateCity.city),
    };
  }

  static getRandomStateCityWithAddress() {
    const stateCity = this.getRandomStateCity();
    return {
      ...stateCity,
      address: this.generateAddressForStateCity(stateCity.state, stateCity.city),
    };
  }
}
