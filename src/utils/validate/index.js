const validate = () => {
    return {
        api: ({ data, status, statusText }) => {
            if (data && status === 200 && statusText === 'OK') {
                return true;
            }
            throw 'Server API error. Please try again';
        }
    }
}

export default validate(); // Singleton