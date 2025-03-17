import ItemList from "../src/components/ItemList";

function App() {
    const apiUrl = import.meta.env.VITE_API_URI; // ✅ Load API URL from .env

    console.log("API URL:", apiUrl); // Debugging: Check if API URL is loaded

    return (
        <div>
            <h1>Item List</h1>
            <ItemList apiUrl={apiUrl} />
        </div>
    );
}

export default App;
