-- Add functions for swipe and matching logic

-- Function to handle a swipe action
CREATE OR REPLACE FUNCTION public.handle_swipe(
  swiper_id uuid,
  target_id uuid, 
  swipe_direction text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  existing_swipe record;
  reverse_swipe record;
  new_match_id uuid;
  result jsonb;
BEGIN
  -- Check if user already swiped on this target
  SELECT * INTO existing_swipe 
  FROM swipes 
  WHERE user_id = swiper_id AND target_user_id = target_id;
  
  -- If already swiped, return existing result
  IF existing_swipe IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Already swiped on this user',
      'match', false
    );
  END IF;
  
  -- Insert the swipe
  INSERT INTO swipes (user_id, target_user_id, direction)
  VALUES (swiper_id, target_id, swipe_direction);
  
  -- If it's a left swipe, no need to check for match
  IF swipe_direction = 'left' THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Swipe recorded',
      'match', false
    );
  END IF;
  
  -- Check if target user also swiped right on swiper
  SELECT * INTO reverse_swipe
  FROM swipes 
  WHERE user_id = target_id 
    AND target_user_id = swiper_id 
    AND direction = 'right';
    
  -- If mutual right swipe, create match
  IF reverse_swipe IS NOT NULL THEN
    -- Ensure consistent user ordering for match
    INSERT INTO matches (user1_id, user2_id)
    VALUES (
      CASE WHEN swiper_id < target_id THEN swiper_id ELSE target_id END,
      CASE WHEN swiper_id < target_id THEN target_id ELSE swiper_id END
    )
    RETURNING id INTO new_match_id;
    
    -- Create conversation
    INSERT INTO conversations (user1_id, user2_id, match_id, status)
    VALUES (
      CASE WHEN swiper_id < target_id THEN swiper_id ELSE target_id END,
      CASE WHEN swiper_id < target_id THEN target_id ELSE swiper_id END,
      new_match_id,
      'active'
    );
    
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Its a match!',
      'match', true,
      'match_id', new_match_id
    );
  END IF;
  
  -- Just a right swipe, no match yet
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Swipe recorded',
    'match', false
  );
END;
$$;

-- Function to get potential matches for a user
CREATE OR REPLACE FUNCTION public.get_potential_matches(
  user_id_param uuid,
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  user_id uuid,
  name text,
  avatar_url text,
  school text,
  major text,
  bio text,
  class_year text,
  interests text[],
  looking_for_roommate boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.user_id,
    up.name,
    up.avatar_url,
    up.school,
    up.major,
    up.bio,
    up.class_year,
    up.interests,
    up.looking_for_roommate
  FROM user_profiles up
  WHERE up.user_id != user_id_param
    AND up.user_id NOT IN (
      -- Exclude users already swiped on
      SELECT s.target_user_id 
      FROM swipes s 
      WHERE s.user_id = user_id_param
    )
    AND up.verified = true -- Only show verified users
  ORDER BY up.created_at DESC
  LIMIT limit_count;
END;
$$;