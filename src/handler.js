/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    // const { name, year, author, summary,
    //     publisher, pageCount, readPage, reading} = request.payload;

    const id = nanoid(16);
    const finished = (request.payload.pageCount === request.payload.readPage);
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
                'bookId': id,
            },
        }).code(201);
    }

    return h.response({
        'status': 'error',
        'message': 'Buku gagal ditambahkan',
    }).code(500);
};

const getBooksHandler = (request, h) => {
    let {name, reading, finished} = request.query;

    let tempBooks = books;

    if (name !== undefined) {
        name = name.toLowerCase();
        tempBooks = tempBooks.filter((book) => book.name.toLowerCase().includes(name));
    }

    if (reading !== undefined) {
        if (reading == 0) {
            reading = false;
            tempBooks = tempBooks.filter((book) => book.reading === reading);
        } else if (reading == 1) {
            reading = true;
            tempBooks = tempBooks.filter((book) => book.reading === reading);
        };
    }

    if (finished !== undefined) {
        if (finished == 0) {
            finished = false;
            tempBooks = tempBooks.filter((book) => book.finished === finished);
        } else if (finished == 1) {
            finished = true;
            tempBooks = tempBooks.filter((book) => book.finished === finished);
        };
    }

    const booksInfo = tempBooks.map((book) => {
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

const getSpecificBookHandler = (request, h) => {
    const {id} = request.params;

    const book = books.find((b) => b.id === id);

    if (book !== undefined) {
        return h.response({
            status: 'success',
            data: {
                book,
            },
        });
    };

    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    }).code(404);
};

const updateBookHandler = (request, h) => {
    const {id} = request.params;
    const body = request.payload;

    if (body.name === undefined) {
        return h.response({
            'status': 'fail',
            'message': 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (body.readPage > body.pageCount) {
        return h.response({
            'status': 'fail',
            'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const idx = books.findIndex((b) => b.id === id);

    if (idx === -1) {
        return h.response({
            'status': 'fail',
            'message': 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    // update buku
    books[idx] = {
        ...books[idx],
        ...body,
    };

    return h.response({
        'status': 'success',
        'message': 'Buku berhasil diperbarui',
    });
};

const deleteBookHandler = (request, h) => {
    const {id} = request.params;
    const idx = books.findIndex((b) => b.id === id);

    if (idx === -1) {
        return h.response({
            'status': 'fail',
            'message': 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(idx, 1);
    return h.response({
        'status': 'success',
        'message': 'Buku berhasil dihapus',
    });
};

module.exports = {
    addBookHandler,
    getBooksHandler,
    getSpecificBookHandler,
    updateBookHandler,
    deleteBookHandler,
};
