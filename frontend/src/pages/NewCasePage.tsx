import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepForm from '@/components/form/StepForm';
import { crfSchema } from '@/data/crf-schema';
import { casesApi } from '@/lib/api/cases';
import type { FormData } from '@/types/form';

export default function NewCasePage() {
  const navigate = useNavigate();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 创建新病例
  useEffect(() => {
    const createCase = async () => {
      try {
        const response = await casesApi.create();
        setCaseId(response.id);
      } catch (err: any) {
        setError('创建病例失败，请重试');
        console.error('创建病例失败:', err);
      } finally {
        setLoading(false);
      }
    };

    createCase();
  }, []);

  // 保存草稿
  const handleSaveDraft = async (data: FormData) => {
    if (!caseId) return;

    try {
      await casesApi.saveDraft(caseId, data);
      console.log('草稿已保存');
    } catch (err: any) {
      console.error('保存草稿失败:', err);
    }
  };

  // 提交表单
  const handleSubmit = async (data: FormData) => {
    if (!caseId) return;

    try {
      await casesApi.submit(caseId, data);
      alert('病例提交成功！');
      navigate('/dashboard');
    } catch (err: any) {
      setError('提交失败，请重试');
      console.error('提交失败:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">正在创建病例...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-6">
          <h2 className="text-lg font-semibold mb-2">创建失败</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            返回首页
          </button>
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
