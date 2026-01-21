import ormconfig from '../../../ormconfig';
import { seedAdminUser } from './admin-user.seed';

async function runSeeds() {
  try {
    console.log('开始执行种子数据...');

    await ormconfig.initialize();
    console.log('✓ 数据库连接成功');

    await seedAdminUser(ormconfig);

    await ormconfig.destroy();
    console.log('✓ 种子数据执行完成');
    process.exit(0);
  } catch (error) {
    console.error('✗ 种子数据执行失败:', error);
    process.exit(1);
  }
}

runSeeds();
