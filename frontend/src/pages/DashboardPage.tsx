import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { casesApi, type CaseListItem } from '@/lib/api/cases';

type TabType = 'all' | 'draft' | 'submitted';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 加载病例列表
  const loadCases = async () => {
    try {
      const response = await casesApi.getList();
      // 后端返回的是 { items, total, page, limit, totalPages }
      setCases(Array.isArray(response) ? response : response.items || []);
    } catch (err) {
      console.error('加载病例失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 删除草稿
  const handleDelete = async (id: string, displayName: string) => {
    if (window.confirm(`确定要删除草稿 "${displayName}" 吗？此操作无法撤销。`)) {
      setDeletingId(id);
      try {
        await casesApi.delete(id);
        // 从列表中移除已删除的项
        setCases(cases.filter(c => c.id !== id));
        // 显示成功提示
        alert('草稿已删除');
      } catch (err: any) {
        console.error('删除失败:', err);
        const errorMsg = err.response?.data?.message || err.message || '未知错误';
        alert(`删除失败：${errorMsg}\n\n请检查您的网络连接或联系管理员`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // 指定时区为上海时间，确保正确显示
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Shanghai',
      hour12: false,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">草稿</span>;
      case 'submitted':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">已提交</span>;
      case 'reviewed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">已审核</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">{status}</span>;
    }
  };

  // 过滤病例
  const filteredCases = cases.filter(c => {
    if (activeTab === 'all') return true;
    return c.status === activeTab;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* 头部用户信息 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">欢迎回来，{user?.fullName || user?.username}！</h1>
            <p className="text-gray-600">角色: {user?.role === 'admin' ? '管理员' : '用户'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      {/* 病例列表 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">病例记录</h2>
          <button
            onClick={() => navigate('/cases/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            新建病例
          </button>
        </div>

        {/* 标签页切换 */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'all'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            全部 ({cases.length})
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'draft'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            草稿 ({cases.filter(c => c.status === 'draft').length})
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'submitted'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            已提交 ({cases.filter(c => c.status === 'submitted').length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无记录</p>
            <p className="text-sm mt-2">点击"新建病例"开始填写表单</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(caseItem.status)}
                      {caseItem.hospitalName && (
                        <span className="text-sm text-gray-600">
                          {caseItem.hospitalName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      患者住院号: {caseItem.patientHospitalId || '未填写'}
                    </p>
                    <p className="text-xs text-gray-500">
                      创建时间: {formatDate(caseItem.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      最后保存: {formatDate(caseItem.updatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {caseItem.status === 'draft' ? (
                      <>
                        <button
                          onClick={() => navigate(`/cases/${caseItem.id}/edit`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                        >
                          继续填写
                        </button>
                        <button
                          onClick={() => handleDelete(caseItem.id)}
                          disabled={deletingId === caseItem.id}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === caseItem.id ? '删除中...' : '删除'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate(`/cases/${caseItem.id}`)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                        >
                          查看详情
                        </button>
                        <button
                          onClick={() => navigate(`/cases/${caseItem.id}/edit`)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                        >
                          编辑
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
