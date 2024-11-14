import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {getJWT} from "../security/AuthProvider";
import { LazyLoadImage } from 'react-lazy-load-image-component';


const ProductManage = () => {
    const navigate = useNavigate();
    const location = useLocation()
    let product = location.state;
    const [versionNumber,setVersionNumber] = useState(product !== null ? product.versions.length : 0)
    const [categories, setCategories] = useState([]);
    const [variants , setVariants] = useState(product !== null ? product.versions: [] );
    const [productName , setProductName] = useState(product !== null ?product.name : "");
    const [category,setCategory] = useState(product !== null ?product.category:null);
    const [description, setDescription] = useState(product !== null ?product.description : "")
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const token = getJWT("token")
    const getCategory = (categoryName)=> {
        setCategory(categories.filter(category=> category.name === categoryName)[0])
    }
    const addVariant = () => {
        const newVariant = {
            indexId: versionNumber,
            versionName: '',
            price: 0,
            stock: 0,
            status:1
        };
        setVersionNumber((versionNumber)=> versionNumber+1)
        setVariants([...variants, newVariant]);
    };

    const removeVariant = (id) => {
        setVariants(variants.filter(variant => variant.indexId !== id));
    };

    const updateVariant = (id, field, value) => {
        setVariants(variants.map(variant =>
            variant.indexId === id? { ...variant,[field]:value} : variant
        ));
    };
    useEffect(()=> {

        for (let i = 0; i < versionNumber; i++) {
            variants[i] = {
                ...variants[i],
                indexId: i
            }
        }
        const getCategories = async () => {
            try {
                const response = await fetch('http://localhost:9090/api/products/getAllCategories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm header Authorization nếu cần
                        'Authorization': 'Bearer ' + token
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
        };
        getCategories()
    },[])
    const addProductCall = async () => {
        try {
            await handleUpload()
            product = {
                ...product,
                name : productName,
                description : description,
                category : category,
                versions: variants
            }

            let response;
            if (!product.id) {
                 response = await fetch('http://localhost:9090/api/products/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm header Authorization nếu cần
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(product)
                });
            } else {
                response = await fetch(`http://localhost:9090/api/products/update/${product.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        // Thêm header Authorization nếu cần
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(product)
                });
            }
            if (!response.ok) {
                throw new Error('Không Thể Thêm Sản Phẩm');
            }
            const data = await response.json();
            navigate("/shop",{state:data})
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };


    // upload file
    const handleFileChange = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const fileReader = new FileReader()
            fileReader.onload = (e) => setPreviewUrl(e.target?.result)
            fileReader.readAsDataURL(file)
        }
    }
    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const response = await fetch("http://localhost:9090/api/images/upload", {
            method: "POST",
            body: formData
        });
        const imgPath = await response.text();
        product = {
            ...product,
            imagePath:imgPath
        }
    };

    return (
        <div>
            <div className="container mt-4">
            <h1 className="mb-4">Add New Product</h1>

                <div className="mb-3">
                    <label htmlFor="productImage" className="form-label">Product Image</label>
                    <input type="file" className="form-control" id="productImage" accept="image/*" onChange={handleFileChange}/>
                    {previewUrl && (
                            <div style={{ width: "100px", height: "100px", position: "relative" }}>
                                <LazyLoadImage
                                    src={previewUrl}
                                    alt="Preview"
                                    className="image-preview rounded"
                                />
                            </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input type="text" className="form-control" id="productName" value={productName} onChange={(e)=> setProductName(e.target.value)} required/>
                </div>

                <div className="mb-3">
                    <label htmlFor="productCategory" className="form-label">Category</label>
                    <select className="form-select" id="productCategory" value={category!== null ?category.name :""} onChange={(e)=> getCategory(e.target.value)} required>
                        <option value="">Select a category</option>
                        {
                            categories.map((category) => (<option value={category.name}>{category.name}</option>))
                        }
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="productDescription" className="form-label">Product Description</label>
                    <textarea className="form-control" id="productDescription" rows="3" value={description} onChange={(e)=> setDescription(e.target.value)} required></textarea>
                </div>

                <h3 className="mt-4 mb-3">Product Variants</h3>

                <button type="button" className="btn btn-secondary mb-3" id="addVariantBtn" onClick={addVariant}>Add Variant</button>
                <div id="variantsContainer">
                    {
                        variants.map((variant)=> (
                            <div key={variant.indexId} className="variant-row mb-3 p-3 border rounded">
                                <div className="row">
                                    <div className="col-md-3 mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Variant Name"
                                            value={variant.versionName}
                                            onChange={(e) => updateVariant(variant.indexId, 'versionName', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 mb-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Price"
                                            step="0.01"
                                            value={variant.price}
                                            onChange={(e) => updateVariant(variant.indexId, 'price', parseFloat(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 mb-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Stock"
                                            value={variant.stock}
                                            onChange={(e) => updateVariant(variant.indexId, 'stock', parseInt(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3 mb-2">
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeVariant(variant.indexId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
                <div className="mb-3">

                </div>

                <button className="btn btn-primary" onClick={addProductCall}>Add Product</button>
            </div>

        </div>
    )
}
export default ProductManage