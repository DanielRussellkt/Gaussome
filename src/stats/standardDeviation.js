const R = require('ramda')

const standardDeviation = R.compose(Math.sqrt, R.mean, array => {
    const mean = R.mean(array);
    return R.map(value => Math.pow(value - mean, 2), array)
})

module.exports = standardDeviation