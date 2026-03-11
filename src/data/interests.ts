export interface Interest {
  id: string;
  label: string;
  emoji: string;
  category: string;
}

export const INTERESTS: Interest[] = [
  // Social
  { id: 'parties', label: 'Parties', emoji: '🎉', category: 'Social' },
  { id: 'bars', label: 'Bars', emoji: '🍻', category: 'Social' },
  { id: 'clubs', label: 'Clubs', emoji: '🪩', category: 'Social' },
  { id: 'greek-life', label: 'Greek Life', emoji: '🏛️', category: 'Social' },
  { id: 'hangouts', label: 'Hangouts', emoji: '🤙', category: 'Social' },
  { id: 'board-games', label: 'Board Games', emoji: '🎲', category: 'Social' },
  { id: 'volunteering', label: 'Volunteering', emoji: '🤝', category: 'Social' },

  // Sports
  { id: 'sports', label: 'Sports', emoji: '⚽', category: 'Sports' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀', category: 'Sports' },
  { id: 'soccer', label: 'Soccer', emoji: '⚽', category: 'Sports' },
  { id: 'football', label: 'Football', emoji: '🏈', category: 'Sports' },
  { id: 'baseball', label: 'Baseball', emoji: '⚾', category: 'Sports' },
  { id: 'hockey', label: 'Hockey', emoji: '🏒', category: 'Sports' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾', category: 'Sports' },
  { id: 'golf', label: 'Golf', emoji: '⛳', category: 'Sports' },
  { id: 'swimming', label: 'Swimming', emoji: '🏊', category: 'Sports' },
  { id: 'volleyball', label: 'Volleyball', emoji: '🏐', category: 'Sports' },
  { id: 'track', label: 'Track & Field', emoji: '🏃', category: 'Sports' },
  { id: 'lacrosse', label: 'Lacrosse', emoji: '🥍', category: 'Sports' },
  { id: 'surfing', label: 'Surfing', emoji: '🏄', category: 'Sports' },
  { id: 'skiing', label: 'Skiing', emoji: '⛷️', category: 'Sports' },
  { id: 'skateboarding', label: 'Skateboarding', emoji: '🛹', category: 'Sports' },

  // Fitness
  { id: 'gym', label: 'Gym', emoji: '💪', category: 'Fitness' },
  { id: 'running', label: 'Running', emoji: '🏃‍♂️', category: 'Fitness' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘', category: 'Fitness' },
  { id: 'crossfit', label: 'CrossFit', emoji: '🏋️', category: 'Fitness' },
  { id: 'hiking', label: 'Hiking', emoji: '🥾', category: 'Fitness' },
  { id: 'cycling', label: 'Cycling', emoji: '🚴', category: 'Fitness' },
  { id: 'martial-arts', label: 'Martial Arts', emoji: '🥋', category: 'Fitness' },
  { id: 'dance', label: 'Dance', emoji: '💃', category: 'Fitness' },
  { id: 'pilates', label: 'Pilates', emoji: '🤸', category: 'Fitness' },

  // Music
  { id: 'music', label: 'Music', emoji: '🎵', category: 'Music' },
  { id: 'rap', label: 'Rap', emoji: '🎤', category: 'Music' },
  { id: 'hip-hop', label: 'Hip Hop', emoji: '🎧', category: 'Music' },
  { id: 'r-and-b', label: 'R&B', emoji: '🎶', category: 'Music' },
  { id: 'indie', label: 'Indie', emoji: '🎸', category: 'Music' },
  { id: 'rock', label: 'Rock', emoji: '🤘', category: 'Music' },
  { id: 'edm', label: 'EDM', emoji: '🔊', category: 'Music' },
  { id: 'pop', label: 'Pop', emoji: '🎀', category: 'Music' },
  { id: 'country', label: 'Country', emoji: '🤠', category: 'Music' },
  { id: 'jazz', label: 'Jazz', emoji: '🎷', category: 'Music' },
  { id: 'concerts', label: 'Concerts', emoji: '🎪', category: 'Music' },
  { id: 'djing', label: 'DJing', emoji: '🎛️', category: 'Music' },
  { id: 'music-production', label: 'Music Production', emoji: '🎹', category: 'Music' },
  

  // Entertainment
  { id: 'movies', label: 'Movies', emoji: '🎬', category: 'Entertainment' },
  { id: 'tv-shows', label: 'TV Shows', emoji: '📺', category: 'Entertainment' },
  { id: 'anime', label: 'Anime', emoji: '🍥', category: 'Entertainment' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮', category: 'Entertainment' },
  { id: 'streaming', label: 'Streaming', emoji: '📱', category: 'Entertainment' },
  { id: 'comedy', label: 'Comedy', emoji: '😂', category: 'Entertainment' },
  { id: 'podcasts', label: 'Podcasts', emoji: '🎙️', category: 'Entertainment' },
  { id: 'youtube', label: 'YouTube', emoji: '▶️', category: 'Entertainment' },
  { id: 'tiktok', label: 'TikTok', emoji: '📲', category: 'Entertainment' },
  { id: 'reality-tv', label: 'Reality TV', emoji: '🌹', category: 'Entertainment' },

  // Food & Drink
  { id: 'food', label: 'Food', emoji: '🍣', category: 'Food & Drink' },
  { id: 'cooking', label: 'Cooking', emoji: '👨‍🍳', category: 'Food & Drink' },
  { id: 'restaurants', label: 'Restaurants', emoji: '🍽️', category: 'Food & Drink' },
  { id: 'coffee', label: 'Coffee', emoji: '☕', category: 'Food & Drink' },
  { id: 'boba', label: 'Boba', emoji: '🧋', category: 'Food & Drink' },
  { id: 'baking', label: 'Baking', emoji: '🧁', category: 'Food & Drink' },
  { id: 'sushi', label: 'Sushi', emoji: '🍱', category: 'Food & Drink' },
  { id: 'brunch', label: 'Brunch', emoji: '🥞', category: 'Food & Drink' },
  
  { id: 'late-night-food', label: 'Late Night Food', emoji: '🌙', category: 'Food & Drink' },

  // Travel
  { id: 'travel', label: 'Travel', emoji: '✈️', category: 'Travel' },
  { id: 'vacation', label: 'Vacation', emoji: '🏝️', category: 'Travel' },
  { id: 'road-trips', label: 'Road Trips', emoji: '🚗', category: 'Travel' },
  { id: 'beach', label: 'Beach', emoji: '🏖️', category: 'Travel' },
  { id: 'camping', label: 'Camping', emoji: '⛺', category: 'Travel' },
  { id: 'backpacking', label: 'Backpacking', emoji: '🎒', category: 'Travel' },
  { id: 'city-exploring', label: 'City Exploring', emoji: '🏙️', category: 'Travel' },

  // Academic
  { id: 'business', label: 'Business', emoji: '📈', category: 'Academic' },
  { id: 'startups', label: 'Startups', emoji: '🚀', category: 'Academic' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', emoji: '💡', category: 'Academic' },
  { id: 'investing', label: 'Investing', emoji: '💰', category: 'Academic' },
  
  { id: 'economics', label: 'Economics', emoji: '📊', category: 'Academic' },
  { id: 'engineering', label: 'Engineering', emoji: '⚙️', category: 'Academic' },
  { id: 'computer-science', label: 'Computer Science', emoji: '💻', category: 'Academic' },
  { id: 'medicine', label: 'Medicine', emoji: '🩺', category: 'Academic' },
  { id: 'law', label: 'Law', emoji: '⚖️', category: 'Academic' },
  { id: 'psychology', label: 'Psychology', emoji: '🧠', category: 'Academic' },
  { id: 'science', label: 'Science', emoji: '🔬', category: 'Academic' },
  { id: 'math', label: 'Math', emoji: '🔢', category: 'Academic' },
  { id: 'research', label: 'Research', emoji: '📝', category: 'Academic' },
  { id: 'pre-med', label: 'Pre-Med', emoji: '💊', category: 'Academic' },

  // Creative
  { id: 'photography', label: 'Photography', emoji: '📸', category: 'Creative' },
  { id: 'art', label: 'Art', emoji: '🎨', category: 'Creative' },
  { id: 'drawing', label: 'Drawing', emoji: '✏️', category: 'Creative' },
  { id: 'design', label: 'Design', emoji: '🖌️', category: 'Creative' },
  { id: 'filmmaking', label: 'Filmmaking', emoji: '🎥', category: 'Creative' },
  { id: 'writing', label: 'Writing', emoji: '✍️', category: 'Creative' },
  { id: 'content-creation', label: 'Content Creation', emoji: '📱', category: 'Creative' },
  { id: 'fashion-design', label: 'Fashion Design', emoji: '👗', category: 'Creative' },
  { id: 'graphic-design', label: 'Graphic Design', emoji: '🎨', category: 'Creative' },

  // Lifestyle
  { id: 'fashion', label: 'Fashion', emoji: '👔', category: 'Lifestyle' },
  { id: 'fitness', label: 'Fitness', emoji: '🏋️', category: 'Lifestyle' },
  { id: 'self-improvement', label: 'Self Improvement', emoji: '📖', category: 'Lifestyle' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘‍♂️', category: 'Lifestyle' },
  { id: 'skincare', label: 'Skincare', emoji: '✨', category: 'Lifestyle' },
  { id: 'thrifting', label: 'Thrifting', emoji: '🛍️', category: 'Lifestyle' },
  { id: 'reading', label: 'Reading', emoji: '📚', category: 'Lifestyle' },
  { id: 'shopping', label: 'Shopping', emoji: '🛒', category: 'Lifestyle' },
  { id: 'sneakers', label: 'Sneakers', emoji: '👟', category: 'Lifestyle' },
  { id: 'cars', label: 'Cars', emoji: '🚗', category: 'Lifestyle' },

  // Tech
  { id: 'coding', label: 'Coding', emoji: '👨‍💻', category: 'Tech' },
  { id: 'ai', label: 'AI', emoji: '🤖', category: 'Tech' },
  { id: 'crypto', label: 'Crypto', emoji: '🪙', category: 'Tech' },
  { id: 'tech', label: 'Tech', emoji: '📱', category: 'Tech' },
  { id: 'web-dev', label: 'Web Dev', emoji: '🌐', category: 'Tech' },
  { id: 'robotics', label: 'Robotics', emoji: '🦾', category: 'Tech' },

  // Pets & Nature
  { id: 'dogs', label: 'Dogs', emoji: '🐕', category: 'Pets & Nature' },
  { id: 'cats', label: 'Cats', emoji: '🐈', category: 'Pets & Nature' },
  { id: 'animals', label: 'Animals', emoji: '🐾', category: 'Pets & Nature' },
  { id: 'nature', label: 'Nature', emoji: '🌿', category: 'Pets & Nature' },
  { id: 'sustainability', label: 'Sustainability', emoji: '♻️', category: 'Pets & Nature' },

  // College Life
  { id: 'roommate-search', label: 'Roommate Search', emoji: '🏠', category: 'College Life' },
  { id: 'study-groups', label: 'Study Groups', emoji: '📝', category: 'College Life' },
];

export const INTEREST_CATEGORIES = [...new Set(INTERESTS.map(i => i.category))];
