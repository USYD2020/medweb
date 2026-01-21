import apiClient from './client';
import type { FormData, CaseData, CaseStatus } from '@/types/form';

export interface CreateCaseResponse {
  id: string;
  status: CaseStatus;
  createdAt: string;
}

export interface CaseListItem {
  id: string;
  patientHospitalId?: string;
  hospitalName?: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}

export const casesApi = {
  // 创建新病例
  create: async (): Promise<CreateCaseResponse> => {
    const response = await apiClient.post('/cases');
    return response.data;
  },

  // 保存草稿 - 使用 PUT /cases/${id} 并发送 answers 字段
  saveDraft: async (id: string, data: FormData): Promise<void> => {
    await apiClient.put(`/cases/${id}`, { answers: data });
  },

  // 提交表单 - 使用 POST /cases/${id}/submit 并先保存数据
  submit: async (id: string, data: FormData): Promise<void> => {
    // 先保存数据
    await apiClient.put(`/cases/${id}`, { answers: data });
    // 再提交
    await apiClient.post(`/cases/${id}/submit`);
  },

  // 获取病例详情
  getById: async (id: string): Promise<CaseData> => {
    const response = await apiClient.get(`/cases/${id}`);
    return response.data;
  },

  // 获取病例列表
  getList: async (): Promise<CaseListItem[]> => {
    const response = await apiClient.get<{ items: CaseListItem[] }>('/cases');
    return response.data.items;
  },

  // 删除病例
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/cases/${id}`);
  },
};
