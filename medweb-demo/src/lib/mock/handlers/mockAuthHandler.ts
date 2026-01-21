/**
 * Mock认证处理器
 * 处理登录、注册、登出等认证相关API
 */

import { mockStorage } from '../mockStorage';
import { generateToken, randomDelay } from '../utils';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  hospital: string;
  department?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    fullName: string;
    hospital: string;
    department?: string;
    role: 'user' | 'admin';
  };
}

// 登录处理
export async function handleLogin(data: LoginRequest): Promise<AuthResponse> {
  await randomDelay();

  const { username, password } = data;
  const user = mockStorage.findUserByUsername(username);

  if (!user || user.password !== password) {
    throw new Error('用户名或密码错误');
  }

  // 生成token
  const token = generateToken(user.id);
  mockStorage.saveToken(token, user.id);

  return {
    accessToken: token,
    refreshToken: token, // Demo中refreshToken和accessToken相同
    expiresIn: 86400, // 24小时
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      hospital: user.hospital,
      department: user.department,
      role: user.role
    }
  };
}

// 注册处理
export async function handleRegister(data: RegisterRequest): Promise<AuthResponse> {
  await randomDelay();

  const { username, password, fullName, hospital, department } = data;

  // 检查用户名是否已存在
  if (mockStorage.findUserByUsername(username)) {
    throw new Error('用户名已存在');
  }

  // 创建新用户
  const newUser = mockStorage.createUser({
    username,
    password,
    fullName,
    hospital,
    department
  });

  // 生成token
  const token = generateToken(newUser.id);
  mockStorage.saveToken(token, newUser.id);

  return {
    accessToken: token,
    refreshToken: token,
    expiresIn: 86400,
    user: {
      id: newUser.id,
      username: newUser.username,
      fullName: newUser.fullName,
      hospital: newUser.hospital,
      department: newUser.department,
      role: newUser.role
    }
  };
}

// 登出处理
export async function handleLogout(token: string): Promise<void> {
  await randomDelay();
  mockStorage.removeToken(token);
}

// 获取当前用户信息
export async function handleGetCurrentUser(token: string): Promise<AuthResponse['user']> {
  await randomDelay();

  const tokenData = mockStorage.findToken(token);
  if (!tokenData) {
    throw new Error('Token无效或已过期');
  }

  const user = mockStorage.findUserById(tokenData.userId);
  if (!user) {
    throw new Error('用户不存在');
  }

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    hospital: user.hospital,
    department: user.department,
    role: user.role
  };
}
