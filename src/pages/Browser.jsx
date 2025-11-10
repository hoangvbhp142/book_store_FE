import { Link } from "react-router-dom"
import BookCard from '../components/BookCard'
import PagingBar from '../components/PagingBar'
import FilterSidebar from '../components/FilterSidebar'
import books from '../data/Books'
import BookList from "../components/BookList"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchBooks } from "../stores/bookSlice"

const Browser = () => {

    const dispatch = useDispatch();
    const { bookList, loading, error } = useSelector(state => state.books);

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <FilterSidebar />
                        <div className="flex-1">
                            <div className="mb-4 text-sm text-gray-600">Showing 1-20 of 1,234 results</div>
                            <BookList books={books} />
                            <div className="mt-12 flex items-center justify-center">
                                <PagingBar totalPages={2} pageSize={10} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Browser
