-- Chat Interno entre Admins

CREATE TABLE IF NOT EXISTS public.admin_chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  mentions TEXT[], -- Array of @mentioned emails
  has_attachment BOOLEAN DEFAULT false,
  attachment_url TEXT,
  attachment_name TEXT,
  thread_id UUID, -- For replies
  edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_chat_read_receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES admin_chat_messages(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_email)
);

-- Indexes for performance
CREATE INDEX idx_chat_messages_created_at ON admin_chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_sender ON admin_chat_messages(sender_email);
CREATE INDEX idx_chat_messages_thread ON admin_chat_messages(thread_id);
CREATE INDEX idx_chat_read_receipts_message ON admin_chat_read_receipts(message_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE admin_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_chat_read_receipts;
