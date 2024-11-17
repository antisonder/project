import db from './schema';
import type { User } from '../stores/auth';

export interface Tweet {
  id: number;
  content: string;
  user: User;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export function createUser(username: string, password: string, name: string) {
  const stmt = db.prepare(`
    INSERT INTO users (username, password, name)
    VALUES (?, ?, ?)
    RETURNING id, username, name, avatar
  `);
  return stmt.get(username, password, name) as User;
}

export function getUser(username: string, password: string) {
  const stmt = db.prepare(`
    SELECT id, username, name, avatar
    FROM users
    WHERE username = ? AND password = ?
  `);
  return stmt.get(username, password) as User | undefined;
}

export function createTweet(userId: number, content: string) {
  const stmt = db.prepare(`
    INSERT INTO tweets (user_id, content)
    VALUES (?, ?)
    RETURNING id, content, created_at as createdAt
  `);
  return stmt.get(userId, content);
}

export function getTweets(currentUserId?: number) {
  const stmt = db.prepare(`
    SELECT 
      t.id,
      t.content,
      t.created_at as createdAt,
      u.id as userId,
      u.username,
      u.name,
      u.avatar,
      COUNT(DISTINCT l.id) as likes,
      MAX(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) as isLiked
    FROM tweets t
    JOIN users u ON t.user_id = u.id
    LEFT JOIN likes l ON t.id = l.tweet_id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `);
  
  const tweets = stmt.all(currentUserId || 0) as any[];
  return tweets.map(tweet => ({
    id: tweet.id,
    content: tweet.content,
    createdAt: tweet.createdAt,
    user: {
      id: tweet.userId,
      username: tweet.username,
      name: tweet.name,
      avatar: tweet.avatar
    },
    likes: tweet.likes,
    isLiked: Boolean(tweet.isLiked)
  })) as Tweet[];
}

export function toggleLike(userId: number, tweetId: number) {
  const existingLike = db.prepare(`
    SELECT id FROM likes WHERE user_id = ? AND tweet_id = ?
  `).get(userId, tweetId);

  if (existingLike) {
    db.prepare(`DELETE FROM likes WHERE id = ?`).run(existingLike.id);
    return false;
  } else {
    db.prepare(`
      INSERT INTO likes (user_id, tweet_id)
      VALUES (?, ?)
    `).run(userId, tweetId);
    return true;
  }
}