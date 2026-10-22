 
 const testErrorPage = async () => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
 }
 
 export { testErrorPage }