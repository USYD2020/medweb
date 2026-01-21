/**
 * Mock工具函数
 */

// 生成UUID
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
}

// 模拟网络延迟
export function randomDelay(min: number = 300, max: number = 800): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// 获取当前时间ISO字符串
export function now(): string {
  return new Date().toISOString();
}

// 格式化日期
export function formatDate(date: string): string {
  return new Date(date).toLocaleString('zh-CN');
}

// 简单的Base64编码token生成（仅用于Demo）
export function generateToken(userId: string): string {
  const payload = {
    userId,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24小时过期
    iat: Date.now()
  };
  return btoa(JSON.stringify(payload));
}

// 验证token
export function verifyToken(token: string): { userId: string; exp: number } | null {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null; // Token过期
    }
    return { userId: payload.userId, exp: payload.exp };
  } catch {
    return null;
  }
}
