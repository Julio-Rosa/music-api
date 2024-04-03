const queryOptions = (req) => {
    const options = {};

    // PAGINATION
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    options.limit = pageSize;
    options.offset = (page - 1) * pageSize;

  // SORTING  
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'ASC';

    options.order = [[sortBy,sortOrder]];

    return options;

}


module.exports = {
    queryOptions
}