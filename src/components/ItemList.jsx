import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Item from "../components/Item";

const ItemList = ({ apiUrl }) => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!apiUrl) {
            setError("API URL is missing.");
            return;
        }

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched data:", data);
                setItems(data);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Error fetching items");
            });
    }, [apiUrl]);

    const handleDelete = (id) => {
        fetch(`${apiUrl}/${id}`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete");
                }
                return response.json();
            })
            .then(() => {
                setItems((prevItems) => prevItems.filter((item) => item.id !== id));
            })
            .catch((err) => {
                console.error("Delete error:", err);
                setError("Error deleting item");
            });
    };

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {items.length > 0 ? (
                    items.map((item) => <Item key={item.id} item={item} onDelete={handleDelete} />)
                ) : (
                    <p>No items available.</p>
                )}
            </ul>
        </div>
    );
};

// ✅ Define PropTypes
ItemList.propTypes = {
    apiUrl: PropTypes.string.isRequired,
};

export default ItemList;
