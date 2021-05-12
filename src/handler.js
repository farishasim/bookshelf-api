/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    // const { name, year, author, summary,
    //     publisher, pageCount, readPage, reading} = request.payload;

    const id = nanoid(16);
    const finished = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const newBook = {
        id,
        ...request.payload,
        finished,
        insertedAt,
        updatedAt,
    };

    if (newBook.name === undefined) {
        return h.response({
            'status': 'fail',
            'message': 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (newBook.readPage > newBook.pageCount) {
        return h.response({
            'status': 'fail',
            'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        return h.response({
            'status': 'success',
            'message': 'Buku berhasil ditambahkan',
            'data': {
                'bookId': '1L7ZtDUFeGs7VlEt',
            },
        }).code(201);
    }

    return h.response({
        'status': 'error',
        'message': 'Buku gagal ditambahkan',
    }).code(500);
};

const getBooksHandler = (request, h) => {
    const booksInfo = books.map((book) => {
        const {id, name, publisher} = book;
        return {id, name, publisher};
    });

    return {
        'status': 'success',
        'data': {
            'books': booksInfo,
        },
    };
};

module.exports = {
    addBookHandler,
    getBooksHandler,
};
