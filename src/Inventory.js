import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import "./App.css";

function Inventory({ user }) {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        quantity: "",
        category: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ price: "", quantity: "" });

    // fetch products in real-time
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(items);
        });
        return () => unsub();
    }, []);

    // handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // add product
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.quantity || !form.category) return;

        await addDoc(collection(db, "products"), {
            ...form,
            price: Number(form.price),
            quantity: Number(form.quantity),
            userId: user.uid, // link product to user
        });

        setForm({ name: "", price: "", quantity: "", category: "" });
    };

    // delete
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "products", id));
    };

    // edit
    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditForm({ price: product.price, quantity: product.quantity });
    };

    const handleSave = async (id) => {
        await updateDoc(doc(db, "products", id), {
            price: Number(editForm.price),
            quantity: Number(editForm.quantity),
        });
        setEditingId(null);
    };

    return (
        <div className="app">
            <div className="navbar">Inventory Management System</div>

            {/* Add Product */}
            <form className="product-form" onSubmit={handleSubmit}>
                <h2>Add Product</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={handleChange}
                />
                <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Books">Books</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Sports">Sports</option>
                    <option value="Toys">Toys</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Other">Other</option>
                </select>
                <button type="submit">Add Product</button>
            </form>

            {/* Table */}
            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price ($)</th>
                            <th>Quantity</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products
                            .filter((p) => p.userId === user.uid) // show only this user's products
                            .map((p) => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>
                                        {editingId === p.id ? (
                                            <input
                                                type="number"
                                                value={editForm.price}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, price: e.target.value })
                                                }
                                            />
                                        ) : (
                                            p.price
                                        )}
                                    </td>
                                    <td>
                                        {editingId === p.id ? (
                                            <input
                                                type="number"
                                                value={editForm.quantity}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, quantity: e.target.value })
                                                }
                                            />
                                        ) : (
                                            p.quantity
                                        )}
                                    </td>
                                    <td>{p.category}</td>
                                    <td>
                                        {editingId === p.id ? (
                                            <>
                                                <button onClick={() => handleSave(p.id)}>Save</button>
                                                <button onClick={() => setEditingId(null)}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(p)}>Edit</button>
                                                <button onClick={() => handleDelete(p.id)}>
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Inventory;
