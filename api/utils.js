export const transactionMadeEarlierThanXMinutes = (timestamp, x) => {
    const timestampMs = timestamp * 1000;
    const currentTimeMs = Date.now();
    const differenceMinutes = (currentTimeMs - timestampMs) / (1000 * 60);
    return differenceMinutes <= x;
}
