export default async function handler(req, res) {
  try {
    return res.status(200).json({
      success: true,
      message: 'API is working!',
      env: {
        mongodb: !!process.env.MONGODB_URI,
        email: !!process.env.EMAIL_USER
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}