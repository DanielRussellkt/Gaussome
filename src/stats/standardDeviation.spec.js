const standardDeviation = require('./standardDeviation')
const test = require('ava')

function macro(t, input, output) {
    t.is(standardDeviation(input), output)
}

test('Standard Deviation is correct for Basic Data', macro, [1, 2, 2, 2, 1, 1], 0.5);
test('Standard Deviation is correct for Positive and Negative Data', macro, [-1, -1, 0, 0, 1, 1], 0.816496580927726);
test('Standard Deviation is correct for Negative Decimal Data', macro, [-5, -2.5, -1.25, -0.25], 1.776583800443987);
test('Standard Deviation is correct for Positive Decimal Data', macro, [5, 2.5, 1.25, 0.25], 1.776583800443987);
test('Standard Deviation has a High Degree of Precision', macro, [0.00025, 0.000125, 0.0000625, 0, -500, -0.00025], 186.3390121004688);
