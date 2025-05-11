import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://default:dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB@redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com:12675'
});

const REDIS_KEY = 'FULLSTACK_TASK_VIVEK';

(async () => {
  try {
    await redisClient.connect();

    const data = await redisClient.get(REDIS_KEY);
    if (!data) {
      console.log('ℹ️ No tasks found in Redis.');
      process.exit(0);
    }

    let tasks = JSON.parse(data);

    if (!Array.isArray(tasks)) {
      console.error('❌ Redis data is not an array. Aborting.');
      process.exit(1);
    }

    const cleanedTasks = tasks.map((taskObj) => {
      if (
        typeof taskObj.task === 'object' &&
        taskObj.task !== null &&
        typeof taskObj.task.task === 'string'
      ) {
        return {
          task: taskObj.task.task,
          createdAt: taskObj.createdAt,
        };
      }

      if (typeof taskObj.task === 'string') {
        return taskObj;
      }

      return null;
    }).filter(Boolean);

    await redisClient.set(REDIS_KEY, JSON.stringify(cleanedTasks));
    console.log(`✅ Cleaned ${cleanedTasks.length} tasks and saved to Redis.`);

    await redisClient.quit();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error cleaning Redis tasks:', err);
    await redisClient.quit();
    process.exit(1);
  }
})();
