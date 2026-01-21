/**
 * Mock数据存储服务
 * 使用localStorage模拟数据库
 */

import { generateId, now } from './utils';

// 存储键名常量
const STORAGE_KEYS = {
  USERS: 'mock_users',
  CASES: 'mock_cases',
  CURRENT_USER: 'mock_current_user',
  TOKENS: 'mock_tokens'
};

// 类型定义
export interface MockUser {
  id: string;
  username: string;
  password: string;
  fullName: string;
  hospital: string;
  department?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface MockCase {
  id: string;
  userId: string;
  status: 'draft' | 'submitted';
  formData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export interface MockToken {
  token: string;
  userId: string;
  expiresAt: number;
}

// 存储操作类
class MockStorage {
  // 初始化默认数据
  initialize() {
    if (!this.getUsers()) {
      this.setUsers([this.getDefaultUser()]);
    }
    if (!this.getCases()) {
      this.setCases([]);
    }
    if (!this.getTokens()) {
      this.setTokens([]);
    }
  }

  // 获取默认演示用户
  private getDefaultUser(): MockUser {
    return {
      id: generateId('user'),
      username: 'admin',
      password: 'admin123',
      fullName: '演示管理员',
      hospital: '上海交通大学医学院附属瑞金医院',
      department: '急诊科',
      role: 'admin',
      createdAt: now()
    };
  }

  // === 用户操作 ===
  getUsers(): MockUser[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : null;
  }

  setUsers(users: MockUser[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  findUserByUsername(username: string): MockUser | undefined {
    const users = this.getUsers();
    return users?.find(u => u.username === username);
  }

  findUserById(id: string): MockUser | undefined {
    const users = this.getUsers();
    return users?.find(u => u.id === id);
  }

  createUser(userData: Omit<MockUser, 'id' | 'createdAt' | 'role'>): MockUser {
    const users = this.getUsers() || [];
    const newUser: MockUser = {
      id: generateId('user'),
      ...userData,
      role: 'user',
      createdAt: now()
    };
    users.push(newUser);
    this.setUsers(users);
    return newUser;
  }

  // === 病例操作 ===
  getCases(): MockCase[] {
    const data = localStorage.getItem(STORAGE_KEYS.CASES);
    return data ? JSON.parse(data) : [];
  }

  setCases(cases: MockCase[]) {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  }

  findCaseById(id: string): MockCase | undefined {
    const cases = this.getCases();
    return cases?.find(c => c.id === id);
  }

  getCasesByUserId(userId: string): MockCase[] {
    const cases = this.getCases();
    return cases?.filter(c => c.userId === userId).sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  createCase(userId: string): MockCase {
    const cases = this.getCases() || [];
    const newCase: MockCase = {
      id: generateId('case'),
      userId,
      status: 'draft',
      formData: {},
      createdAt: now(),
      updatedAt: now()
    };
    cases.push(newCase);
    this.setCases(cases);
    return newCase;
  }

  updateCase(id: string, updates: Partial<MockCase>): MockCase | null {
    const cases = this.getCases();
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) return null;

    cases[index] = {
      ...cases[index],
      ...updates,
      updatedAt: now()
    };
    this.setCases(cases);
    return cases[index];
  }

  deleteCase(id: string): boolean {
    const cases = this.getCases();
    const filtered = cases.filter(c => c.id !== id);
    if (filtered.length === cases.length) return false;
    this.setCases(filtered);
    return true;
  }

  // === Token操作 ===
  getTokens(): MockToken[] {
    const data = localStorage.getItem(STORAGE_KEYS.TOKENS);
    return data ? JSON.parse(data) : [];
  }

  setTokens(tokens: MockToken[]) {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  }

  findToken(token: string): MockToken | undefined {
    const tokens = this.getTokens();
    return tokens?.find(t => t.token === token && t.expiresAt > Date.now());
  }

  saveToken(token: string, userId: string): void {
    const tokens = this.getTokens() || [];
    // 删除该用户的旧token
    const filtered = tokens.filter(t => t.userId !== userId);
    // 添加新token
    filtered.push({
      token,
      userId,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24小时
    });
    this.setTokens(filtered);
  }

  removeToken(token: string): void {
    const tokens = this.getTokens();
    const filtered = tokens.filter(t => t.token !== token);
    this.setTokens(filtered);
  }

  // === 清理操作 ===
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    this.initialize();
  }
}

// 导出单例
export const mockStorage = new MockStorage();

// 初始化
mockStorage.initialize();
