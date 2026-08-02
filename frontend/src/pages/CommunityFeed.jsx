import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Heart, MessageSquare, Plus, MapPin, Send, Image as ImageIcon } from 'lucide-react';
import TrustScoreBadge from '../components/TrustScoreBadge';
import API from '../services/api';

const CommunityFeed = () => {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPostModal, setShowPostModal] = useState(false);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Tiger Point, Lonavala');
  const [commentInput, setCommentInput] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/posts');
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/posts', { image, caption, location });
      if (res.data.success) {
        setShowPostModal(false);
        setCaption('');
        fetchPosts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish post');
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const res = await API.put(`/posts/${postId}/like`);
      if (res.data.success) {
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    const text = commentInput[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await API.post(`/posts/${postId}/comments`, { text });
      if (res.data.success) {
        setCommentInput({ ...commentInput, [postId]: '' });
        fetchPosts();
      }
    } catch (err) {
      alert('Comment failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest block mb-1">
            Travel Stories & Moments
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Community Feed</h1>
        </div>

        {user && (
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Share Story</span>
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 text-center py-12">Loading travel feed...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 card-shadow">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No community posts yet</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => {
            const isLiked = user && post.likes?.includes(user._id);

            return (
              <div key={post._id} className="bg-white rounded-3xl border border-slate-200/90 card-shadow overflow-hidden">
                
                {/* Author Info Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                      alt={post.user?.name}
                      className="w-10 h-10 rounded-2xl object-cover border-2 border-indigo-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{post.user?.name}</h3>
                        <TrustScoreBadge score={post.user?.trustScore || 75} showLabel={false} />
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-600" />
                        {post.location} • <span className="font-semibold">{post.user?.organization}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Photo */}
                <div className="max-h-96 overflow-hidden bg-slate-900">
                  <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
                </div>

                {/* Content & Actions */}
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={() => handleToggleLike(post._id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-rose-600 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                      <span>{post.likes?.length || 0} Likes</span>
                    </button>

                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>{post.comments?.length || 0} Comments</span>
                    </span>
                  </div>

                  {post.caption && (
                    <p className="text-xs text-slate-700 leading-relaxed mb-4">
                      <span className="font-bold text-slate-900 mr-2">{post.user?.name}</span>
                      {post.caption}
                    </p>
                  )}

                  {/* Comments List */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 max-h-36 overflow-y-auto">
                      {post.comments.map((c, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-bold text-slate-900 mr-1.5">{c.user?.name || 'User'}:</span>
                          <span className="text-slate-600">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  {user && (
                    <form onSubmit={(e) => handleAddComment(post._id, e)} className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInput[post._id] || ''}
                        onChange={(e) => setCommentInput({ ...commentInput, [post._id]: e.target.value })}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none flex-grow"
                      />
                      <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Share Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 card-shadow">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Share Travel Moment</h3>
            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <input
                type="text"
                required
                placeholder="Location (e.g. Tiger Point, Lonavala)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <textarea
                rows="3"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="w-1/2 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunityFeed;
