import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/entities/user.entity';

export async function seedAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' },
  });

  if (existingAdmin) {
    console.log('✓ 管理员账号已存在');
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@123456', 12);

  const admin = userRepository.create({
    username: 'admin',
    passwordHash,
    status: 'approved',
    role: 'admin',
    fullName: '系统管理员',
    hospital: '系统',
    department: '技术部',
    position: '管理员',
  });

  await userRepository.save(admin);
  console.log('✓ 管理员账号创建成功');
  console.log('  用户名: admin');
  console.log('  密码: Admin@123456');
}
