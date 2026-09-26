"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Send, CheckCircle2, User, ShieldCheck } from 'lucide-react';

export default function TicketConversationPage() {
  const params = useParams();
  const id = params?.id as string;

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/support/${id}`);
      const data = await res.json();
      if (data.success) {
        setTicket(data.ticket);
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTicket();
  }, [id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setSending(true);
      const res = await fetch(`/api/admin/support/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyText,
          sender_name: 'AADHYA Concierge',
          sender_role: 'admin'
        })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText('');
        fetchTicket();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleMarkResolved = async () => {
    try {
      await fetch(`/api/admin/support/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      fetchTicket();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-bold text-gray-400 animate-pulse">Loading ticket thread...</div>;
  }

  if (!ticket) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-sm font-bold text-gray-700">Support Ticket Not Found</div>
        <Link href="/admin/support" className="text-xs font-bold text-[#cca05b]">
          ← Back to Support
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/support"
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tickets</span>
        </Link>

        {ticket.status !== 'RESOLVED' && (
          <button
            onClick={handleMarkResolved}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-700"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Ticket Resolved</span>
          </button>
        )}
      </div>

      {/* Ticket Meta Info */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-black text-gray-400 uppercase">
            {ticket.ticket_number} • {ticket.category}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
            ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {ticket.status}
          </span>
        </div>
        <h1 className="text-xl font-black text-gray-900">{ticket.subject}</h1>
        <div className="text-xs font-semibold text-gray-500 flex flex-wrap gap-4 pt-1">
          <span>Customer: <strong className="text-gray-900">{ticket.customer_name}</strong></span>
          <span>Email: <strong className="text-gray-900">{ticket.customer_email}</strong></span>
          {ticket.related_order_number && (
            <span>Order Ref: <strong className="text-[#cca05b] font-mono">{ticket.related_order_number}</strong></span>
          )}
        </div>
      </div>

      {/* Message History Thread */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          Conversation History
        </h2>

        <div className="space-y-4">
          {messages.map((m) => {
            const isAdmin = m.sender_role === 'admin';
            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl text-xs space-y-2 max-w-xl ${
                  isAdmin
                    ? 'ml-auto bg-[#faf8f4] border border-[#cca05b]/30 text-gray-900'
                    : 'mr-auto bg-gray-50 border border-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className={isAdmin ? 'text-[#cca05b]' : 'text-gray-600'}>
                    {m.sender_name} {isAdmin ? '• AADHYA Specialist' : '• Customer'}
                  </span>
                  <span className="text-gray-400 font-normal">
                    {new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="leading-relaxed font-medium whitespace-pre-wrap">{m.message}</p>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendReply} className="pt-4 border-t border-gray-100 space-y-3">
          <textarea
            rows={3}
            required
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your official response to the customer..."
            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl text-xs text-gray-900 focus:outline-none focus:border-[#cca05b]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-xl shadow hover:bg-[#d8ae69] transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? 'Sending...' : 'Send Reply'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
