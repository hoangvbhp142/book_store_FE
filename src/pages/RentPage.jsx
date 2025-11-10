import React from 'react';
import { Link } from 'react-router-dom';
import {
    Clock,
    CheckCircle2,
    Package,
    TrendingUp,
    Star
} from 'lucide-react';
// Giả sử path đúng cho Footer

const RentPage = () => {
    const popularRentals = [
        {
            id: 1,
            title: "The Midnight Library",
            author: "Matt Haig",
            rating: 4.8,
            reviews: 2341,
            monthlyPrice: 4.99,
            threeMonthPrice: 12.99,
            image: "/rent-book-1.jpg?height=400&width=300&query=popular rental book 1",
        },
        {
            id: 2,
            title: "Atomic Habits",
            author: "James Clear",
            rating: 4.9,
            reviews: 5678,
            monthlyPrice: 5.99,
            threeMonthPrice: 15.99,
            image: "/rent-book-2.jpg?height=400&width=300&query=popular rental book 2",
        },
        {
            id: 3,
            title: "Project Hail Mary",
            author: "Andy Weir",
            rating: 4.7,
            reviews: 1892,
            monthlyPrice: 4.99,
            threeMonthPrice: 12.99,
            image: "/rent-book-3.jpg?height=400&width=300&query=popular rental book 3",
        },
        {
            id: 4,
            title: "The Seven Husbands of Evelyn Hugo",
            author: "Taylor Jenkins Reid",
            rating: 4.8,
            reviews: 3456,
            monthlyPrice: 4.99,
            threeMonthPrice: 12.99,
            image: "/rent-book-4.jpg?height=400&width=300&query=popular rental book 4",
        },
    ];

    const newReleases = [
        {
            id: 5,
            title: "Tomorrow, and Tomorrow, and Tomorrow",
            author: "Gabrielle Zevin",
            rating: 4.6,
            reviews: 892,
            monthlyPrice: 6.99,
            threeMonthPrice: 18.99,
            image: "/rent-book-5.jpg?height=400&width=300&query=new release rental 1",
        },
        {
            id: 6,
            title: "Lessons in Chemistry",
            author: "Bonnie Garmus",
            rating: 4.7,
            reviews: 1234,
            monthlyPrice: 5.99,
            threeMonthPrice: 15.99,
            image: "/rent-book-6.jpg?height=400&width=300&query=new release rental 2",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-gray-50/30 py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">Rent Books, Save Money</h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed text-balance">
                                Access thousands of books for a fraction of the purchase price. Flexible rental periods with free
                                shipping both ways.
                            </p>
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors">
                                <Link to="/store?filter=rentals">Browse Rentals</Link>
                            </button>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="container mx-auto px-4 py-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">How Renting Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-transparent">
                            <div className="pt-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                    <Package className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                                    1
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Choose Your Book</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Browse our collection and select the rental period that works for you
                                </p>
                            </div>
                        </div>

                        <div className="bg-transparent">
                            <div className="pt-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                                    2
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Read & Enjoy</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Free shipping to your door. Take your time and enjoy your book
                                </p>
                            </div>
                        </div>

                        <div className="bg-transparent">
                            <div className="pt-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                                    3
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Return or Extend</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Return with free shipping or extend your rental anytime
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Rental Benefits */}
                <section className="bg-gray-50/30 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">Why Rent?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">70%</div>
                                <p className="text-sm text-gray-600 leading-relaxed">Save up to 70% compared to buying</p>
                            </div>

                            <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">FREE</div>
                                <p className="text-sm text-gray-600 leading-relaxed">Free shipping both ways, always</p>
                            </div>

                            <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">30+</div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Flexible rental periods from 1-6 months
                                </p>
                            </div>

                            <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                                <p className="text-sm text-gray-600 leading-relaxed">Books available for rental</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Rentals */}
                <section className="container mx-auto px-4 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold">Popular Rentals</h2>
                        <button className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors">
                            <Link to="/store?filter=popular-rentals">View All</Link>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {popularRentals.map((book) => (
                            <Link key={book.id} to={`/book/${book.id}`} className="group">
                                <div className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-[2/3] bg-gray-100 relative">
                                        <img
                                            src={book.image || "/placeholder.svg"}
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" />
                                            Popular
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 mb-2">by {book.author}</p>
                                        <div className="flex items-center gap-1 mb-3">
                                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                            <span className="text-xs font-medium">{book.rating}</span>
                                            <span className="text-xs text-gray-500">({book.reviews})</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <label className="flex-1">
                                                    <input type="radio" name={`period-${book.id}`} value="1month" defaultChecked className="sr-only" />
                                                    <span className="block px-2 py-1 text-xs border border-gray-300 rounded cursor-pointer hover:bg-gray-50">1 Month</span>
                                                </label>
                                                <label className="flex-1">
                                                    <input type="radio" name={`period-${book.id}`} value="3months" className="sr-only" />
                                                    <span className="block px-2 py-1 text-xs border border-gray-300 rounded cursor-pointer hover:bg-gray-50">3 Months</span>
                                                </label>
                                            </div>
                                            <div id={`price-1month-${book.id}`} className="font-bold text-sm">
                                                ${book.monthlyPrice}/mo
                                            </div>
                                            <div id={`price-3months-${book.id}`} className="font-bold text-sm hidden">
                                                ${book.threeMonthPrice}
                                                <p className="text-xs text-gray-600">${(book.threeMonthPrice / 3).toFixed(2)}/mo</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* New Releases */}
                <section className="bg-gray-50/30 py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold">New Release Rentals</h2>
                            <button className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors">
                                <Link to="/store?filter=new-rentals">View All</Link>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {newReleases.map((book) => (
                                <Link key={book.id} to={`/book/${book.id}`}>
                                    <div className="bg-white rounded-lg border hover:shadow-lg transition-shadow overflow-hidden">
                                        <div className="p-0">
                                            <div className="flex gap-4 p-4">
                                                <div className="w-24 h-32 bg-gray-100 rounded flex-shrink-0 relative">
                                                    <img
                                                        src={book.image || "/placeholder.svg"}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 bg-blue-100 text-blue-800">
                                                        New Release
                                                    </span>
                                                    <h3 className="font-semibold mb-1 line-clamp-2">{book.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                                                    <div className="flex items-center gap-1 mb-3">
                                                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                        <span className="text-sm font-medium">{book.rating}</span>
                                                        <span className="text-sm text-gray-500">({book.reviews})</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-bold">${book.monthlyPrice}/month</p>
                                                        <p className="text-sm text-gray-600">or ${book.threeMonthPrice} for 3 months</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-20">
                    <div className="bg-blue-600 text-white border-none rounded-lg">
                        <div className="p-12 text-center">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">Start renting books today</h2>
                            <p className="text-lg mb-8 text-white/90 text-balance max-w-2xl mx-auto leading-relaxed">
                                Join thousands of readers who save money by renting. No commitment, cancel anytime.
                            </p>
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors">
                                <Link to="/store?filter=rentals">Browse All Rentals</Link>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default RentPage;