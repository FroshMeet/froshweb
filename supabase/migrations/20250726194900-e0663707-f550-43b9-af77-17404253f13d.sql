-- Add RLS policies for all new messaging tables

-- Swipes policies
CREATE POLICY "Users can view their own swipes"
ON public.swipes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own swipes"
ON public.swipes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view their matches"
ON public.matches FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Conversations policies
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their conversations"
ON public.conversations FOR UPDATE
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Private messages policies
CREATE POLICY "Users can view messages in their conversations"
ON public.private_messages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.conversations c 
  WHERE c.id = conversation_id 
  AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
));

CREATE POLICY "Users can send messages in their conversations"
ON public.private_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id 
  AND EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can update their own messages"
ON public.private_messages FOR UPDATE
USING (auth.uid() = sender_id);

-- Message requests policies
CREATE POLICY "Users can view requests sent to them"
ON public.message_requests FOR SELECT
USING (auth.uid() = to_user_id OR auth.uid() = from_user_id);

CREATE POLICY "Users can send message requests"
ON public.message_requests FOR INSERT
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update requests sent to them"
ON public.message_requests FOR UPDATE
USING (auth.uid() = to_user_id);