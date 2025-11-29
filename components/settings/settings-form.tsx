'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { InterviewSettings, Company } from '@/lib/db';

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy' },
  { value: 'echo', label: 'Echo' },
  { value: 'shimmer', label: 'Shimmer' },
  { value: 'sage', label: 'Sage' },
];

const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'persian', label: 'Persian' },
];

const STRICTNESS_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const CONVERSATION_FLOW_OPTIONS = [
  'greeting',
  'company_introduction',
  'candidate_introduction',
  'hr_interview',
  'technical_interview',
  'candidate_questions',
  'closing',
];

export default function SettingsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('ontime');
  const [settings, setSettings] = useState<Partial<InterviewSettings>>({});
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    company_id: '',
    company_name: '',
    interview_field: '',
  });

  // بارگذاری لیست شرکت‌ها
  const loadCompanies = () => {
    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error('Error loading companies:', err));
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // بارگذاری تنظیمات
  useEffect(() => {
    setLoading(true);
    fetch(`/api/settings?company_id=${selectedCompanyId}`)
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading settings:', err);
        setLoading(false);
      });
  }, [selectedCompanyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          company_id: selectedCompanyId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/');
      } else {
        alert('Failed to save settings: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/companies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCompany,
          conversation_flow: CONVERSATION_FLOW_OPTIONS.join(','),
          include_hr: true,
          include_technical: true,
          voice: 'shimmer',
          language: 'english',
          strictness_level: 'medium',
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Company added successfully!');
        setShowAddCompany(false);
        setNewCompany({ company_id: '', company_name: '', interview_field: '' });
        loadCompanies();
        setSelectedCompanyId(newCompany.company_id);
      } else {
        alert('Failed to add company: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding company:', error);
      alert('Failed to add company');
    } finally {
      setSaving(false);
    }
  };

  const toggleFlowItem = (item: string) => {
    const currentFlow = settings.conversation_flow?.split(',') || [];
    const newFlow = currentFlow.includes(item)
      ? currentFlow.filter((i) => i !== item)
      : [...currentFlow, item];
    setSettings({ ...settings, conversation_flow: newFlow.join(',') });
  };

  if (loading) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Interview Settings</h1>
        <button
          onClick={() => setShowAddCompany(!showAddCompany)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {showAddCompany ? 'Cancel' : '+ Add Company'}
        </button>
      </div>

      {/* فرم اضافه کردن شرکت */}
      {showAddCompany && (
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h2 className="text-xl font-bold mb-4">Add New Company</h2>
          <form onSubmit={handleAddCompany} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Company ID (unique identifier)
              </label>
              <input
                type="text"
                required
                value={newCompany.company_id}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, company_id: e.target.value })
                }
                placeholder="e.g., company_acme"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                required
                value={newCompany.company_name}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, company_name: e.target.value })
                }
                placeholder="e.g., Acme Corporation"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Interview Field
              </label>
              <input
                type="text"
                required
                value={newCompany.interview_field}
                onChange={(e) =>
                  setNewCompany({
                    ...newCompany,
                    interview_field: e.target.value,
                  })
                }
                placeholder="e.g., Data Science, Backend Development"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {saving ? 'Adding...' : 'Add Company'}
            </button>
          </form>
        </div>
      )}

      {/* فرم ویرایش تنظیمات */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* انتخاب شرکت */}
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {companies.map((company) => (
              <option key={company.company_id} value={company.company_id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>

        {/* فیلد مصاحبه */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Interview Field
          </label>
          <input
            type="text"
            value={settings.interview_field || ''}
            onChange={(e) =>
              setSettings({ ...settings, interview_field: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., Data Science, Software Engineering"
          />
        </div>

        {/* Include HR/Technical */}
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.include_hr !== false}
              onChange={(e) =>
                setSettings({ ...settings, include_hr: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span>Include HR Questions</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.include_technical !== false}
              onChange={(e) =>
                setSettings({ ...settings, include_technical: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span>Include Technical Questions</span>
          </label>
        </div>

        {/* Voice */}
        <div>
          <label className="block text-sm font-medium mb-2">Voice</label>
          <select
            value={settings.voice || 'shimmer'}
            onChange={(e) => setSettings({ ...settings, voice: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {VOICE_OPTIONS.map((voice) => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={settings.language || 'english'}
            onChange={(e) =>
              setSettings({ ...settings, language: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Strictness Level */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Strictness Level
          </label>
          <select
            value={settings.strictness_level || 'medium'}
            onChange={(e) =>
              setSettings({ ...settings, strictness_level: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
          >
            {STRICTNESS_OPTIONS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Conversation Flow */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Conversation Flow
          </label>
          <div className="space-y-2">
            {CONVERSATION_FLOW_OPTIONS.map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(settings.conversation_flow?.split(',') || []).includes(
                    item
                  )}
                  onChange={() => toggleFlowItem(item)}
                  className="w-4 h-4"
                />
                <span className="capitalize">{item.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save & Start Interview'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
