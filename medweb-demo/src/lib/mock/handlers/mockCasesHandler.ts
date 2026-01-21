/**
 * Mock病例处理器
 * 处理病例的创建、保存、提交等API
 */

import { mockStorage } from '../mockStorage';
import { randomDelay } from '../utils';

interface CreateCaseResponse {
  id: string;
  status: 'draft' | 'submitted';
  createdAt: string;
}

interface SaveDraftRequest {
  formData: Record<string, any>;
}

interface CaseListItem {
  id: string;
  patientHospitalId?: string;
  hospitalName?: string;
  status: 'draft' | 'submitted';
  createdAt: string;
  updatedAt: string;
}

interface CaseDetail extends CreateCaseResponse {
  formData: Record<string, any>;
  updatedAt: string;
  submittedAt?: string;
}

// 创建新病例
export async function handleCreateCase(userId: string): Promise<CreateCaseResponse> {
  await randomDelay();

  const newCase = mockStorage.createCase(userId);

  return {
    id: newCase.id,
    status: newCase.status,
    createdAt: newCase.createdAt
  };
}

// 保存草稿
export async function handleSaveDraft(
  caseId: string,
  data: SaveDraftRequest
): Promise<{ success: boolean; message: string }> {
  await randomDelay();

  const updated = mockStorage.updateCase(caseId, {
    formData: data.formData,
    status: 'draft'
  });

  if (!updated) {
    throw new Error('病例不存在');
  }

  return {
    success: true,
    message: '保存成功'
  };
}

// 提交表单
export async function handleSubmitCase(
  caseId: string,
  data: SaveDraftRequest
): Promise<{ success: boolean; message: string }> {
  await randomDelay();

  const updated = mockStorage.updateCase(caseId, {
    formData: data.formData,
    status: 'submitted',
    submittedAt: new Date().toISOString()
  });

  if (!updated) {
    throw new Error('病例不存在');
  }

  return {
    success: true,
    message: '提交成功'
  };
}

// 获取病例列表
export async function handleGetCases(userId: string): Promise<CaseListItem[]> {
  await randomDelay();

  const cases = mockStorage.getCasesByUserId(userId);

  return cases.map(c => ({
    id: c.id,
    patientHospitalId: c.formData.patientHospitalId,
    hospitalName: c.formData.hospitalName,
    status: c.status,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt
  }));
}

// 获取病例详情
export async function handleGetCase(caseId: string): Promise<CaseDetail> {
  await randomDelay();

  const caseData = mockStorage.findCaseById(caseId);

  if (!caseData) {
    throw new Error('病例不存在');
  }

  return {
    id: caseData.id,
    status: caseData.status,
    formData: caseData.formData,
    createdAt: caseData.createdAt,
    updatedAt: caseData.updatedAt,
    submittedAt: caseData.submittedAt
  };
}

// 删除病例
export async function handleDeleteCase(caseId: string): Promise<{ success: boolean }> {
  await randomDelay();

  const success = mockStorage.deleteCase(caseId);

  if (!success) {
    throw new Error('病例不存在');
  }

  return { success: true };
}
