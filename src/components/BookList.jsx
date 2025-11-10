import React from 'react'
import BookCard from './BookCard'
import { Link } from 'react-router-dom'

const BookList = ({ books }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
                <Link to={{ pathname: `/book/${book.id}` }} key={book.id}>
                    <BookCard key={book.id} book={book} i={index} />
                </Link>
            ))}
        </div>
    )
}

export default BookList
