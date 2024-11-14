import React, {useEffect, useState} from 'react';
import ProductCard from "./ProductCard";
import {useLocation} from "react-router-dom";

const Product = () => {
    const location = useLocation();
    const searchValue = location.state;
    const [products, setProducts] = useState([]);
    const [page,setPage] = useState(0)
    const [pageNumber, setPageNumber] = useState(0);
    const [sortOption,setSortOption] = useState("nothing")
    const [categories, setCategories] = useState([])
    const [selectCategoryId, setSelectCategoryId] = useState(0)
    const [priceFrom, setPriceFrom] = useState(0)
    const [priceTo, setPriceTo] = useState(0)
    const [error, setError] = useState('');
    const handleChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleSetPrice = () => {
        const start = priceFrom
        const end = priceTo

        if (!priceFrom || !priceTo) {
            setError('Vui lòng nhập đầy đủ giá bắt đầu và giá kết thúc');
            return;
        }

        if (start < 0 || end < 0) {
            setError('Giá không được là số âm');
            return;
        }

        if (start >= end) {
            setError('Giá bắt đầu phải nhỏ hơn giá kết thúc');
            return;
        }

        setError('');
    };
    useEffect(()=> {
        const params = new URLSearchParams({
            name: searchValue,
            categoryId: selectCategoryId,
            priceFrom: priceFrom,
            priceTo: priceTo,
            page:page,
        });
        switch (sortOption) {
            case "latest" :
                params.append('sortBy','time');
                params.append('sortDir','desc');
                break

            case "buyersCount":
                params.append('sortBy','buyersCount');
                params.append('sortDir','desc');
                break
            case "rating":
                params.append('sortBy','rating');
                params.append('sortDir','desc');
                break
            case "price-asc":
                params.append('sortBy','price');
                params.append('sortDir','asc');
                break
            case "price-desc":
                params.append('sortBy','price');
                params.append('sortDir','desc');
                break
        }
        const fetchGetCategories = async ()=> {
            try {
                const response = await fetch(`http://localhost:9090/api/products/getCategories?${params.toString()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                });

                if (!response.ok) {
                    throw new Error('Không Thể Lấy Dữ Liệu categories');
                }
                const data = await response.json();
                setCategories(data)
            } catch (error) {
                console.error('Lỗi:', error);
            }
        }
        fetchGetCategories();
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/products/search?${params.toString()}`,
                    {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                });

                if (!response.ok) {
                    throw new Error('Không Thể Lấy Dữ Liệu Product');
                }
                const data = await response.json();
                setPageNumber(data.totalPages)
                setProducts(data.content);
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };

        fetchProducts();
    }, [searchValue,selectCategoryId,priceFrom,priceTo,page,sortOption]);


    return (
        <div>

            <div className="container-fluid fruite py-5">
                <div className="container py-5">
                    <h1 className="mb-4">Fresh fruits shop</h1>
                    <div className="row g-4">
                        <div className="col-lg-12">
                            <div className="row g-4">
                                <div className="col-xl-3">
                                </div>
                                <div className="col-6"></div>
                                <div className="col-xl-3">
                                    <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                                        <label htmlFor="fruits">Default Sorting:</label>
                                        <select id="fruits" name="fruitlist"
                                                className="border-0 form-select-sm bg-light me-3" form="fruitform"
                                                onChange={(event)=>handleChange(event)}>
                                            <option value="nothing">Nothing</option>
                                            <option value="latest">Mới Nhất</option>
                                            <option value="buyersCount">Bán Chạy</option>
                                            <option value="rating">Đánh giá Cao</option>
                                            <option value="price-asc">Giá thấp -> cao</option>
                                            <option value="price-desc">Giá cao -> thấp</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-4">
                                <div className="col-lg-3">
                                    <div className="row g-4">
                                        <div className="col-lg-12">
                                            <div className="mb-3">
                                                <h4>Categories</h4>
                                                <ul className="list-unstyled fruite-categorie">
                                                    {categories.map(category=> (
                                                        <li>
                                                            <div className="d-flex justify-content-between fruite-name">
                                                                <a onClick={()=> setSelectCategoryId(category.id)}>
                                                                    <i className="fas fa-apple-alt me-2"></i>{category.name}
                                                                </a>
                                                            </div>
                                                        </li>
                                                    ))}

                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <h4>Price</h4>
                                            <div className="space-y-4">

                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={priceFrom}
                                                    onChange={(e)=> setPriceFrom(e.target.value)}
                                                    placeholder="Nhập giá bắt đầu"
                                                    min="0"
                                                />
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={priceTo}
                                                    onChange={(e)=> setPriceTo(e.target.value)}
                                                    placeholder="Nhập giá kết thúc"
                                                    min="0"
                                                />

                                                {error && (
                                                    <div className="alert alert-danger" role="alert">
                                                        {error}
                                                    </div>
                                                )}

                                                <button
                                                    className="btn btn-primary w-100"
                                                    onClick={handleSetPrice}
                                                >
                                                    Đặt khoảng giá
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9">
                                    <div className="row g-4 justify-content-center">
                                        {products.map(product => (
                                            <ProductCard product={product}></ProductCard>
                                        ))}
                                        <div className="col-12">
                                            <div className="pagination d-flex justify-content-center mt-5">
                                                <a className="rounded"
                                                   onClick={() => setPage((index) => (index - 1))}>&laquo;</a>
                                                {
                                                    Array.from({length: pageNumber}, (_, index) => (
                                                        index === page ?
                                                            <a key={index} className="active rounded">{index + 1}</a> :
                                                            <a key={index} className="rounded" onClick={() =>setPage(index)}>{index + 1}</a>
                                                    ))
                                                }

                                            <a className="rounded" onClick={()=>setPage((index)=> (index +1))}>&raquo;</a>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )

}
export default Product;