import { Star } from "lucide-react";

const StarRating = ({ rating, size = 'h-5 w-5' }) => {
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);

        // Sao đầy (vàng)
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`full-${i}`}
                    className={`${size} fill-yellow-400 text-yellow-400`}
                />
            );
        }

        // Sao nửa vàng nửa xám
        if (hasHalfStar) {
            const percentage = ((rating % 1) * 100).toFixed(0);
            stars.push(
                <div key="half" className="relative inline-block">
                    <Star className={`${size} fill-gray-300 text-gray-300`} />
                    <div
                        className="absolute top-0 left-0 overflow-hidden"
                        style={{ width: `${percentage}%` }}
                    >
                        <Star className={`${size} fill-yellow-400 text-yellow-400`} />
                    </div>
                </div>
            );
        }

        // Sao rỗng (xám)
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star
                    key={`empty-${i}`}
                    className={`${size} fill-gray-300 text-gray-300`}
                />
            );
        }

        return stars;
    };

    return (
        <div className="flex items-center gap-1">
            {renderStars()}
        </div>
    );
};

export default StarRating;