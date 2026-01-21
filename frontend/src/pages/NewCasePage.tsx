import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepForm from '@/components/form/StepForm';
import { crfSchema } from '@/data/crf-schema';
import { casesApi } from '@/lib/api/cases';
import type { FormData } from '@/types/form';

export default function NewCasePage() {
  const navigate = useNavigate();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // 改为 false，不需要在加载时创建病例
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // 不在页面加载时创建病例，改为在用户开始填写时创建

  // 创建新病例（延迟创建）
  const createCase = async () => {
    if (caseId) return caseId; // 如果已创建，直接返回

    try {
      const response = await casesApi.create();
      setCaseId(response.id);
      return response.id;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '创建病例失败，请重试';
      setError(errorMsg);
      console.error('创建病例失败:', err);
      throw err;
    }
  };

  // 保存草稿
  const handleSaveDraft = async (data: FormData) => {
    // 第一次保存时创建病例
    if (!caseId) {
      try {
        const id = await createCase();
        if (!id) {
          console.error('无法保存草稿：创建病例失败');
          return;
        }
      } catch {
        return;
      }
    }

    try {
      await casesApi.saveDraft(caseId, data);
      console.log('草稿已保存');
    } catch (err: any) {
      console.error('保存草稿失败:', err);
      alert('保存草稿失败，请重试');
    }
  };

  // 提交表单
  const handleSubmit = async (data: FormData) => {
    // 第一次提交时创建病例
    if (!caseId) {
      try {
        const id = await createCase();
        if (!id) {
          setError('创建病例失败，无法提交');
          return;
        }
      } catch {
        return;
      }
    }

    try {
      await casesApi.submit(caseId, data);
      setSubmitSuccess(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '提交失败，请重试';
      setError(errorMsg);
      console.error('提交失败:', err);
    }
  };

  // 错误状态
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-6">
          <h2 className="text-lg font-semibold mb-2">操作失败</h2>
          <p className="mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setError('');
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              重试
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 提交成功状态
  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">提交成功！</h2>
          <p className="text-gray-600 mb-6">您的病例已成功提交，感谢您的参与。</p>
          <div className="flex justify-center gap-3">
            {caseId && (
              <button
                onClick={() => navigate(`/cases/${caseId}`)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                查看详情
              </button>
            )}
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <StepForm
      schema={crfSchema}
      onSave={handleSaveDraft}
      onSubmit={handleSubmit}
    />
  );
}
