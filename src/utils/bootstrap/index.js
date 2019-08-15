import uniqid from 'uniqid';;

const bootstrap = () => {
    const portfolio = window.localStorage.getItem('portfolio');
    const balance = window.localStorage.getItem('balance');
    if (!portfolio) {
        window.localStorage.setItem('portfolio', JSON.stringify([
            {
                symbol: 'AAPL',
                positions: [{
                    position: 100,
                    date: new Date('21-Mar-2019'),
                    price: 199.95,
                    currency: 'USD',
                    key: uniqid()

                }],
                key: uniqid()
            },
            {
                symbol: 'GOOGL',
                positions: [{
                    position: 10,
                    date: new Date('19-Mar-2019'),
                    price: 120.11,
                    currency: 'USD',
                    key: uniqid()

                }],
                key: uniqid()

            }
        ]))
    }
    if (!balance) {
        window.localStorage.setItem('balance', String(100000));
    }
};

export default bootstrap;