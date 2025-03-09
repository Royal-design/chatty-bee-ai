import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="p-2">
      <div className="text-red-500">Hello</div>
      <Button className="hover:bg-red-300 bg-red-500 text-red-100">
        Hover me
      </Button>
    </div>
  );
}

export default App;
