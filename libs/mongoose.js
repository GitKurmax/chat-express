const mongoose = require('mongoose');
const config = require('../config')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
}

module.exports = mongoose


