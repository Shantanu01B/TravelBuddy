const Post = require('../models/Post');

// @desc    Create a community travel post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { image, caption, location } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Please provide an image URL for the post' });
    }

    const post = await Post.create({
      user: req.user._id,
      image,
      caption: caption || '',
      location: location || 'Travel Spot'
    });

    const populatedPost = await Post.findById(post._id).populate('user', 'name avatar organization trustScore');

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all community posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name avatar organization trustScore')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      likesCount: post.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty' });
    }

    post.comments.push({
      user: req.user._id,
      text
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'name avatar organization trustScore')
      .populate('comments.user', 'name avatar');

    res.json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  toggleLikePost,
  addComment
};
