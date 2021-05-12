const {
    addBookHandler,
    getBooksHandler,
    getSpecificBookHandler,
    updateBookHandler,
    deleteBookHandler,
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getSpecificBookHandler,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: updateBookHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookHandler,
    },
];

module.exports = routes;
