import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Menu, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Component cho một danh mục
const CategoryItem = ({
    category,
    level,
    onMouseEnter,
    onMouseLeave,
    onClickMobile,
    isActive,
    isMobile = false,
    itemRef,
    navigate
}) => {
    const hasChildren = category.children && category.children.length > 0;

    const handleItemClick = () => {
        navigate("/category/" + category.id);
        console.log("Clicked!");
    };

    const handleArrowClick = (e) => {
        e.stopPropagation(); // Ngăn chặn sự kiện lan ra div cha
        if (hasChildren && onClickMobile) {
            onClickMobile(category, level);
        }
    };

    return (
        <div
            ref={itemRef}
            className={`relative flex items-center justify-between py-3 px-4 hover:bg-blue-50 cursor-pointer transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : ''
                } ${isMobile ? 'border-b border-gray-100 last:border-b-0' : ''}`}
            onMouseEnter={!isMobile ? (e) => onMouseEnter(category, level, e) : undefined}
            onMouseLeave={!isMobile ? onMouseLeave : undefined}
            onClick={handleItemClick}
        >
            <span className="text-sm flex-1 text-left">{category.name}</span>
            {hasChildren && (
                <ChevronRight
                    className={`h-4 w-4 ${isMobile ? 'text-gray-400' : ''}`}
                    onClick={handleArrowClick}
                />
            )}
        </div>
    );
};

// Component cho một panel danh mục (desktop)
const CategoryPanel = ({ categories, level, onMouseEnter, onMouseLeave, activeCategory, position, navigate }) => {
    return (
        <div
            className="fixed w-64 bg-white border border-gray-200 shadow-lg z-10"
            style={{
                left: `${position.left}px`,
                top: `${position.top}px`
            }}
        >
            <div className="p-2 max-h-[80vh] overflow-y-auto">
                {categories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        level={level}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        isActive={activeCategory && activeCategory.id === category.id}
                        navigate={navigate}
                    />
                ))}
            </div>
        </div>
    );
};

const SimpleFilterSidebar = ({ categories }) => {
    const navigate = useNavigate();

    const [activeCategories, setActiveCategories] = useState([]);
    const [activeCategoryRefs, setActiveCategoryRefs] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [mobileCategoryPath, setMobileCategoryPath] = useState([]);
    const sidebarRef = useRef(null);
    const categoryRefs = useRef({});

    // Kiểm tra kích thước màn hình
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Đóng sidebar khi click bên ngoài (mobile)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
                setMobileCategoryPath([]);
            }
        };

        if (isMobile && isSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile, isSidebarOpen]);

    const displayCategories = categories || [];

    // Desktop handlers
    const handleMouseEnter = (category, level, event) => {
        const target = event?.currentTarget || categoryRefs.current[`${level}-${category.id}`];
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const newActiveCategories = [...activeCategories];
        const newActiveCategoryRefs = [...activeCategoryRefs];

        newActiveCategories[level] = category;
        newActiveCategoryRefs[level] = {
            left: rect.right + 8,
            top: rect.top
        };

        setActiveCategories(newActiveCategories.slice(0, level + 1));
        setActiveCategoryRefs(newActiveCategoryRefs.slice(0, level + 1));
    };

    const handleMouseLeave = () => {
        // Giữ nguyên để hover hoạt động
    };

    const handleSidebarMouseLeave = (e) => {
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget) {
            setActiveCategories([]);
            setActiveCategoryRefs([]);
            return;
        }

        // Kiểm tra xem có đang hover vào dropdown không
        let isHoveringDropdown = false;
        let element = relatedTarget;
        while (element) {
            if (element.classList && element.classList.contains('category-dropdown')) {
                isHoveringDropdown = true;
                break;
            }
            element = element.parentElement;
        }

        if (!isHoveringDropdown && !sidebarRef.current.contains(relatedTarget)) {
            setActiveCategories([]);
            setActiveCategoryRefs([]);
        }
    };

    // Mobile handlers
    const handleMobileCategoryClick = (category, level) => {
        if (category.children && category.children.length > 0) {
            setMobileCategoryPath(prev => [...prev, category]);
        } else {
            setIsSidebarOpen(false);
            setMobileCategoryPath([]);
            console.log('Selected category:', category.name);
        }
    };

    const handleMobileBack = () => {
        if (mobileCategoryPath.length > 0) {
            setMobileCategoryPath(prev => prev.slice(0, -1));
        } else {
            setIsSidebarOpen(false);
        }
    };

    const getCurrentMobileCategories = () => {
        if (mobileCategoryPath.length === 0) {
            return displayCategories;
        }
        return mobileCategoryPath[mobileCategoryPath.length - 1].children;
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (!isSidebarOpen) {
            setMobileCategoryPath([]);
        }
    };

    // Desktop Sidebar
    const DesktopSidebar = () => (
        <>
            <aside
                ref={sidebarRef}
                className="space-y-2.5 bg-white border border-gray-200 shadow-sm overflow-visible"
                onMouseLeave={handleSidebarMouseLeave}
            >
                <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">DANH MỤC</h2>
                    <div className="space-y-1">
                        {displayCategories.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                level={0}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                isActive={activeCategories[0] && activeCategories[0].id === category.id}
                                itemRef={(el) => {
                                    if (el) categoryRefs.current[`0-${category.id}`] = el;
                                }}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                </div>
            </aside>

            {/* Dropdowns */}
            {activeCategories.map((activeCategory, level) => {
                if (activeCategory.children && activeCategory.children.length > 0 && activeCategoryRefs[level]) {
                    return (
                        <div
                            key={activeCategory.id}
                            className="category-dropdown"
                            onMouseLeave={(e) => {
                                const relatedTarget = e.relatedTarget;
                                let isStillInCategory = false;

                                if (relatedTarget) {
                                    let element = relatedTarget;
                                    while (element) {
                                        if (element === sidebarRef.current ||
                                            (element.classList && element.classList.contains('category-dropdown'))) {
                                            isStillInCategory = true;
                                            break;
                                        }
                                        element = element.parentElement;
                                    }
                                }

                                if (!isStillInCategory) {
                                    setActiveCategories([]);
                                    setActiveCategoryRefs([]);
                                }
                            }}
                        >
                            <CategoryPanel
                                categories={activeCategory.children}
                                level={level + 1}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                activeCategory={activeCategories[level + 1]}
                                position={activeCategoryRefs[level]}
                                navigate={navigate}
                            />
                        </div>
                    );
                }
                return null;
            })}
        </>
    );

    // Mobile Sidebar
    const MobileSidebar = () => (
        <>
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 shadow-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 z-30 md:hidden" />
            )}

            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        {mobileCategoryPath.length > 0 ? (
                            <button
                                onClick={handleMobileBack}
                                className="p-1 hover:bg-gray-100 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        ) : (
                            <button
                                onClick={toggleSidebar}
                                className="p-1 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                        <h2 className="font-semibold text-lg text-gray-900">
                            {mobileCategoryPath.length > 0
                                ? mobileCategoryPath[mobileCategoryPath.length - 1].name
                                : 'Danh mục'
                            }
                        </h2>
                    </div>
                    {mobileCategoryPath.length > 0 && (
                        <button
                            onClick={() => {
                                setIsSidebarOpen(false);
                                setMobileCategoryPath([]);
                            }}
                            className="p-1 hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {mobileCategoryPath.length > 0 && (
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-1 text-xs text-gray-500 overflow-x-auto">
                            <button
                                onClick={() => setMobileCategoryPath([])}
                                className="hover:text-blue-600 whitespace-nowrap"
                            >
                                Danh mục
                            </button>
                            {mobileCategoryPath.map((category, index) => (
                                <div key={category.id} className="flex items-center gap-1 whitespace-nowrap">
                                    <ChevronRight className="w-3 h-3" />
                                    {index === mobileCategoryPath.length - 1 ? (
                                        <span className="text-blue-600 font-medium">{category.name}</span>
                                    ) : (
                                        <button
                                            onClick={() => setMobileCategoryPath(mobileCategoryPath.slice(0, index + 1))}
                                            className="hover:text-blue-600"
                                        >
                                            {category.name}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-2 overflow-y-auto h-[calc(100vh-80px)]">
                    <div className="space-y-1">
                        {getCurrentMobileCategories().map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                level={mobileCategoryPath.length}
                                onClickMobile={handleMobileCategoryClick}
                                isActive={false}
                                isMobile={true}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {isMobile ? <MobileSidebar /> : <DesktopSidebar />}
        </>
    );
};

export default SimpleFilterSidebar;