const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const CurrencyShop = require('./models/currencyShop.js')(sequelize, Sequelize.DataTypes);
require('./models/users.js')(sequelize, Sequelize.DataTypes);
require('./models/userItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const shop = [
        CurrencyShop.upsert({ name: 'tea', cost: 1 }),
        CurrencyShop.upsert({ name: 'milk', cost: 2 }),
        CurrencyShop.upsert({ name: 'cum', cost: 20 }),
    ];
    await Promise.all(shop);
    console.log('database synced!');
    sequelize.close();
}).catch(console.error);