/**
 * Mock拦截器
 * 拦截Axios请求并路由到Mock处理函数
 */

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { mockStorage } from './mockStorage';
import { verifyToken } from './utils';
import * as authHandler from './handlers/mockAuthHandler';
import * as casesHandler from './handlers/mockCasesHandler';

// Mock响应类型
interface MockResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
}

// 设置Mock拦截器
export function setupMockInterceptor(axiosInstance: AxiosInstance) {
  // 请求拦截
  axiosInstance.interceptors.request.use(
    async (config) => {
      // 只在Mock模式下处理
      if (import.meta.env.VITE_MOCK_MODE !== 'true') {
        return config;
      }

      console.log('[Mock] Request:', config.method?.toUpperCase(), config.url);

      try {
        const mockResponse = await handleMockRequest(config);
        // 返回一个Promise，将mockResponse作为响应
        return Promise.reject({
          _mock: true,
          response: mockResponse,
          config
        } as any);
      } catch (error: any) {
        // 如果是Mock错误，直接返回
        if (error._mock) {
          return Promise.reject(error);
        }
        // 其他错误正常抛出
        throw error;
      }
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      // 如果是Mock响应，直接返回
      if (error._mock) {
        return Promise.resolve(error.response as AxiosResponse);
      }
      return Promise.reject(error);
    }
  );
}

// 处理Mock请求
async function handleMockRequest(config: InternalAxiosRequestConfig): Promise<MockResponse> {
  const { method, url, data } = config;
  const token = config.headers?.Authorization?.toString().replace('Bearer ', '');

  // 验证token（除了公开接口）
  const isPublicEndpoint = url?.includes('/auth/login') || url?.includes('/auth/register');

  if (!isPublicEndpoint && token) {
    const tokenData = verifyToken(token);
    if (!tokenData) {
      throw {
        _mock: true,
        response: {
          data: { message: 'Token无效或已过期' },
          status: 401,
          statusText: 'Unauthorized'
        }
      };
    }
    // 将userId添加到config中，供后续使用
    (config as any).userId = tokenData.userId;
  }

  // 路由到对应的处理器
  if (url?.includes('/auth/login')) {
    return handleRequest(() => authHandler.handleLogin(JSON.parse(data)));
  }

  if (url?.includes('/auth/register')) {
    return handleRequest(() => authHandler.handleRegister(JSON.parse(data)));
  }

  if (url?.includes('/auth/logout')) {
    return handleRequest(() => authHandler.handleLogout(token!));
  }

  if (url?.includes('/auth/me')) {
    return handleRequest(() => authHandler.handleGetCurrentUser(token!));
  }

  if (url?.includes('/cases')) {
    return handleCaseRequest(method, url, data, (config as any).userId);
  }

  throw new Error(`Mock endpoint not found: ${method} ${url}`);
}

// 处理病例相关请求
async function handleCaseRequest(
  method: string | undefined,
  url: string | undefined,
  data: any,
  userId: string
): Promise<MockResponse> {
  // 提取caseId（如果存在）
  const urlParts = url?.split('/') || [];
  const caseIdIndex = urlParts.indexOf('cases') + 1;
  const caseId = caseIdIndex > 0 && caseIdIndex < urlParts.length ? urlParts[caseIdIndex] : undefined;

  // POST /cases - 创建新病例
  if (method === 'post' && !caseId) {
    return handleRequest(() => casesHandler.handleCreateCase(userId));
  }

  // PUT /cases/:id/draft - 保存草稿
  if (method === 'put' && caseId && url?.includes('/draft')) {
    return handleRequest(() => casesHandler.handleSaveDraft(caseId, JSON.parse(data)));
  }

  // PUT /cases/:id/submit - 提交表单
  if (method === 'put' && caseId && url?.includes('/submit')) {
    return handleRequest(() => casesHandler.handleSubmitCase(caseId, JSON.parse(data)));
  }

  // GET /cases/:id - 获取病例详情
  if (method === 'get' && caseId && !url?.includes('/draft') && !url?.includes('/submit')) {
    return handleRequest(() => casesHandler.handleGetCase(caseId));
  }

  // GET /cases - 获取病例列表
  if (method === 'get' && !caseId) {
    return handleRequest(() => casesHandler.handleGetCases(userId));
  }

  // DELETE /cases/:id - 删除病例
  if (method === 'delete' && caseId) {
    return handleRequest(() => casesHandler.handleDeleteCase(caseId));
  }

  throw new Error(`Mock case endpoint not found: ${method} ${url}`);
}

// 包装处理函数，统一返回格式
async function handleRequest(handler: () => Promise<any>): Promise<MockResponse> {
  try {
    const data = await handler();
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {}
    };
  } catch (error: any) {
    return {
      data: { message: error.message || '请求失败' },
      status: error.status || 400,
      statusText: error.statusText || 'Bad Request',
      headers: {}
    };
  }
}
