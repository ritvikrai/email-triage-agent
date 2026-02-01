'use client'
import { useState } from 'react'
import { Mail, Inbox, Star, Trash2, Clock, Send, RefreshCw, Zap } from 'lucide-react'

const MOCK_EMAILS = [
  { id: 1, from: 'CEO', subject: 'Q4 Strategy Discussion - Need Your Input', preview: 'Hi team, I wanted to get your thoughts on...', priority: 'urgent', action: 'respond', suggestedReply: "Thanks for reaching out. I'll review the Q4 strategy document and share my thoughts by EOD tomorrow." },
  { id: 2, from: 'Newsletter', subject: 'Your Weekly Tech Digest', preview: 'Top stories in AI this week...', priority: 'low', action: 'archive', suggestedReply: null },
  { id: 3, from: 'Client - Acme Corp', subject: 'Project Update Request', preview: 'Could you send us the latest status on...', priority: 'high', action: 'respond', suggestedReply: "Hi! The project is on track. I'll send a detailed status report with the latest metrics by end of week." },
  { id: 4, from: 'HR', subject: 'Benefits Enrollment Reminder', preview: 'Open enrollment ends next Friday...', priority: 'medium', action: 'schedule', suggestedReply: null },
  { id: 5, from: 'GitHub', subject: '[PR] Fix authentication bug #234', preview: 'mikdev requested your review...', priority: 'medium', action: 'respond', suggestedReply: "I'll review this PR today and leave my feedback." },
  { id: 6, from: 'Spam', subject: 'You won $1,000,000!!!', preview: 'Click here to claim your prize...', priority: 'spam', action: 'delete', suggestedReply: null },
]

export default function Home() {
  const [emails, setEmails] = useState(MOCK_EMAILS)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [processing, setProcessing] = useState(false)

  const processEmails = async () => {
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setProcessing(false)
  }

  const handleAction = (id, action) => {
    if (action === 'delete' || action === 'archive') {
      setEmails(prev => prev.filter(e => e.id !== id))
      if (selectedEmail?.id === id) setSelectedEmail(null)
    }
  }

  const priorityConfig = {
    urgent: { color: 'bg-red-500', label: 'Urgent', icon: '🔴' },
    high: { color: 'bg-orange-500', label: 'High', icon: '🟠' },
    medium: { color: 'bg-yellow-500', label: 'Medium', icon: '🟡' },
    low: { color: 'bg-gray-400', label: 'Low', icon: '⚪' },
    spam: { color: 'bg-gray-300', label: 'Spam', icon: '🚫' },
  }

  const actionConfig = {
    respond: { icon: <Send size={14} />, label: 'Respond', color: 'text-blue-600 bg-blue-50' },
    archive: { icon: <Inbox size={14} />, label: 'Archive', color: 'text-gray-600 bg-gray-50' },
    schedule: { icon: <Clock size={14} />, label: 'Schedule', color: 'text-purple-600 bg-purple-50' },
    delete: { icon: <Trash2 size={14} />, label: 'Delete', color: 'text-red-600 bg-red-50' },
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Mail className="text-cyan-600" />
              Email Triage Agent
            </h1>
            <p className="text-gray-600">AI sorts, prioritizes, and drafts responses</p>
          </div>
          <button
            onClick={processEmails}
            disabled={processing}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium flex items-center gap-2"
          >
            {processing ? <RefreshCw className="animate-spin" /> : <Zap />}
            {processing ? 'Processing...' : 'Triage Inbox'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <p className="font-medium text-gray-800">{emails.length} emails to review</p>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-auto">
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedEmail?.id === email.id ? 'bg-cyan-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800 text-sm">{email.from}</span>
                    <span className="text-xs">{priorityConfig[email.priority].icon}</span>
                  </div>
                  <p className="text-sm text-gray-700 truncate">{email.subject}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${actionConfig[email.action].color}`}>
                      {actionConfig[email.action].icon} {actionConfig[email.action].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
            {selectedEmail ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">From: {selectedEmail.from}</p>
                    <h2 className="text-xl font-semibold text-gray-800">{selectedEmail.subject}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs text-white ${priorityConfig[selectedEmail.priority].color}`}>
                    {priorityConfig[selectedEmail.priority].label}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-600">{selectedEmail.preview}</p>
                </div>

                {selectedEmail.suggestedReply && (
                  <div className="border border-cyan-200 rounded-lg p-4 bg-cyan-50">
                    <p className="text-sm font-medium text-cyan-800 mb-2 flex items-center gap-2">
                      <Zap size={16} /> AI Suggested Reply
                    </p>
                    <p className="text-gray-700">{selectedEmail.suggestedReply}</p>
                    <div className="flex gap-2 mt-4">
                      <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <Send size={14} /> Send Reply
                      </button>
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm">Edit</button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <button onClick={() => handleAction(selectedEmail.id, 'archive')} className="px-4 py-2 border border-gray-200 rounded-lg text-sm flex items-center gap-2">
                    <Inbox size={14} /> Archive
                  </button>
                  <button onClick={() => handleAction(selectedEmail.id, 'delete')} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                    <Trash2 size={14} /> Delete
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm flex items-center gap-2">
                    <Star size={14} /> Star
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select an email to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
