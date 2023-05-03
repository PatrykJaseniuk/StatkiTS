export function mesureTime(func: () => void, iterations: number): number {
    const start = new Date().getTime();
    for (let i = 0; i < iterations; i++) {
        func();
    }
    const end = new Date().getTime();
    const time = end - start;
    // console.log(end - start);
    return time;
}

export function calculateMaximumDt(springRate: number, mass1: number, mass2: number) {

    let massMinn = Math.min(mass1, mass2);
    let omegaMax = Math.sqrt(springRate / massMinn);
    return Math.sqrt(2) / omegaMax;
}