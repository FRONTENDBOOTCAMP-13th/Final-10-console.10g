'use client';

import { createMessage } from '@/data/actions/addNotification';
import { LoginUser, User } from '@/types';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface MessageModalProps {
  target: User;
  user: LoginUser;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function MessageModal({ target, user, isOpen, setIsOpen }: MessageModalProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('메시지를 입력하세요.');
      return;
    }

    const sendMessage = async () => {
      const res = await createMessage(message, target, user);

      if (res.ok) {
        console.log('메시지 보내기 성공');
        toast.success('쪽지가 전송되었습니다.');
      } else {
        console.log('메시지 보내기 실패');
        toast.error('쪽지 전송에 실패했습니다.');
      }

      setMessage('');
      setIsOpen(false);
    };

    sendMessage();
  };

  const handleCancel = () => {
    setMessage('');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-primary z-50 w-[400px] max-w-[90%]">
        <p className="mb-2">{target.name}님께 쪽지 보내기</p>
        <textarea name="message" id="message" value={message} onChange={e => setMessage(e.target.value)} className="w-full border rounded p-2 my-2" rows={5} placeholder="메시지를 입력하세요" />
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded cursor-pointer">
            전송
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded cursor-pointer">
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
