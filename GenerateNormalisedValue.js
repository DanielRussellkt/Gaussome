const r = require('ramda')

// Non-zero Math.random
const randomNonZero = (rng) => {
    const value = rng();
    return value === 0 ? randomNonZero(rng): value;
} 

// Generates Z1 and Z2, Independent random variables with a standard normal distribution (Box-Muller Transform)
const generateRandomVariables = (rng) => {
    const calculateR = r.compose(Math.sqrt, (u1) => {
        // R^2 = -2lnU1
        return -2.0 * Math.log(u1);
    })
    
    // Θ = 2πU2
    const calculateΘ = (u2) => 2.0 * Math.PI * u2

    // Generating independent random variables (Uniform distribution)
    const u1 = randomNonZero(rng)
    const u2 = randomNonZero(rng)

    const R = calculateR(u1)
    const Θ = calculateΘ(u2)

    const z1 = R * Math.cos(Θ)
    const z2 = R * Math.sin(Θ)
    return [z1, z2];
};

const randomSkewedNormal = (rng, mean, standardDeviation, skewness = -5) => {
    const [u0, v] = generateRandomVariables(rng);
    if (skewness === 0) {
        // If not skewed, the first independent box-muller variate can be transformed in a standard way
        return mean + standardDeviation * u0;
    }
    // Correlation Coefficient 𝛿
    const 𝛿 = skewness / Math.sqrt(1 + skewness * skewness);
    // Producing a correlated variate to u0
    const u1 = 𝛿 * u0 + Math.sqrt(1 - 𝛿 * 𝛿) * v;
    // Determining skew-normal variate
    const z = u0 >= 0 ? u1 : -u1;

    const transformedVariate = mean + standardDeviation * z;
    return transformedVariate > 0 ? transformedVariate : randomSkewedNormal(rng, mean, standardDeviation, skewness)
};

const distribution = []

for (i = 0; i<20000; i++) {
    distribution.push(
        {
            num: randomSkewedNormal(Math.random, 0.0917, 0.0417, -50).toString()
        }
        )
}

// Pearson 2 Skewness
const skewness = (mean, median, standardDeviation) => {
    return (3 * (mean - median)) / standardDeviation
}

const standardDeviation = r.compose(Math.sqrt, r.mean, array => {
    const mean = r.mean(array);
    return r.map(value => Math.pow(value - mean, 2), array)
})

const analysis = {
    mean: r.mean(distribution),
    median: r.median(distribution),
    standardDeviation: standardDeviation(distribution),
    skewness: skewness(r.mean(distribution), r.median(distribution), standardDeviation(distribution)),
}