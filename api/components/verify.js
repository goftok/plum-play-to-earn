import { kv } from '@vercel/kv';

export const is_valid = async (address) => {
  const record = await kv.hgetall(`user:${address}`);

  if (!record.time_stamp) {
    // Address does not exist in the database, add it with the current timestamp
    await kv.hmset(`user:${address}`, {
      time_stamp: Date.now().toString(),
    });
    return true;
  } else {
    const currentTime = Date.now();
    const timeDifference = currentTime - parseInt(record.time_stamp);

    if (timeDifference > 8 * 60 * 60 * 1000) { // 8 hours in milliseconds
      // Update the timestamp
      await kv.hmset(`user:${address}`, {
        time_stamp: Date.now().toString(),
      });
      return true;
    } else {
      return false;
    }
  }
};