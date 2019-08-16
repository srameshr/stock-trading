const validate = () => {
  return {
    api: ({ data, status, statusText }) => {
      if (data && status === 200 && statusText === 'OK') {
        return true;
      }
      throw 'Server API error. Please try again';
    },
    number: ({ num, name = 'Number', type = {} }) => {
      const val = parseFloat(num, 10);
      Object.keys(type).map(key => {
        switch (key) {
          case 'POSITIVE':
            if (val < 0) {
              throw `${name} should be greater than 0`
            }
            break;
          case 'EXISTS':
            if (!val) {
              throw `${name} is required`
            }
          default:
            break;
        }
      });
      return true;
    }
  }
}

export default validate(); // Singleton