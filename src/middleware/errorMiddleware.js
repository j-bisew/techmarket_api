const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.code === '23505') {
        return res.status(400).json({
            message: 'Duplicate entry',
            error: err.detail
        });
    }
    
    res.status(err.status || 500).json({
        message: err.message || 'Server error occurred',
        error: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;