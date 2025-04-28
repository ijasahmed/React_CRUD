import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import axios from "axios";

const CrudApp = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [currentProduct, setCurrentProduct] = useState({ id: '', name: '', price: '', quantity: '' });
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5286/api/Products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async () => {
        try {
            await axios.post("http://localhost:5286/api/Products", currentProduct);
            alert("Product added successfully!");
            setShowAddModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setIsEditMode(true);
        setShowEditModal(true);
    };

    const handleUpdateProduct = async () => {
        try {
            await axios.put(`http://localhost:5286/api/Products/${currentProduct.id}`, currentProduct);
            alert("Product updated successfully!");
            setShowEditModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:5286/api/Products/${id}`);
                alert("Product deleted successfully!");
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const resetForm = () => {
        setCurrentProduct({ id: '', name: '', price: '', quantity: '' });
        setIsEditMode(false);
    };

    const handleModalClose = () => {
        resetForm();
        setShowAddModal(false);
        setShowEditModal(false);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-primary">🛒 Product Manager</h1>
                <Button variant="success" onClick={() => setShowAddModal(true)}>
                    ➕ Add Product
                </Button>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Price ($)</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <tr key={product.id}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <Button variant="info" size="sm" className="me-2" onClick={() => handleEditProduct(product)}>
                                            ✏️ Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                                            🗑️ Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {/* Add Product Modal */}
            <Modal show={showAddModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={currentProduct.name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={currentProduct.price} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" name="quantity" value={currentProduct.quantity} onChange={handleInputChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    <Button variant="success" onClick={handleAddProduct}>Save Product</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={currentProduct.name} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={currentProduct.price} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" name="quantity" value={currentProduct.quantity} onChange={handleInputChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdateProduct}>Update Product</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CrudApp;
