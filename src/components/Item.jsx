import ItemList from "../components/ItemList";

function App() {
    return (
        <div>
            <h1>Item List</h1>
            <ItemList apiUrl={import.meta.env.VITE_API_URI} />
        </div>
    );
}

export default App;
