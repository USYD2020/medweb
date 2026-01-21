import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ApprovalsService } from '../approvals/approvals.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private approvalsService: ApprovalsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 检查用户名唯一性
    const existingUser = await this.usersService.findByUsername(
      registerDto.username,
    );
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 密码强度验证
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(registerDto.password)) {
      throw new ConflictException(
        '密码强度不足：至少8位，包含大小写字母和数字',
      );
    }

    // 加密密码并创建用户
    const passwordHash = await bcrypt.hash(registerDto.password, 12);
    const user = await this.usersService.create({
      username: registerDto.username,
      passwordHash,
      fullName: registerDto.fullName,
      hospital: registerDto.hospital,
      department: registerDto.department,
      position: registerDto.position,
      phone: registerDto.phone,
      email: registerDto.email,
      purpose: registerDto.purpose,
      status: 'pending',
      role: 'user',
    });

    // 自动创建审核申请
    await this.approvalsService.createApprovalRequest(user.id);

    return { message: '注册成功，请等待管理员审核', userId: user.id };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 检查账号锁定
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000,
      );
      throw new UnauthorizedException(
        `账号已被锁定，请在${remainingMinutes}分钟后重试`,
      );
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      await this.usersService.incrementFailedAttempts(user.id);

      if (user.failedLoginAttempts + 1 >= 5) {
        await this.usersService.lockAccount(user.id, 30);
        throw new UnauthorizedException(
          '密码错误次数过多，账号已被锁定30分钟',
        );
      }

      throw new UnauthorizedException('用户名或密码错误');
    }

    // 检查审核状态
    if (user.status !== 'approved') {
      throw new UnauthorizedException('账号未审核通过，无法登录');
    }

    // 重置失败次数并更新登录时间
    await this.usersService.resetFailedAttempts(user.id);
    await this.usersService.updateLastLogin(user.id);

    // 生成JWT tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken, expiresIn: 900 };
  }
}
