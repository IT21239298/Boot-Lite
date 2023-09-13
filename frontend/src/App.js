import { Outlet } from "react-router-dom";
import Header from "./component/Header";
import { Toaster, toast } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      <div>
        <Header />
        <main className="pt-16 bg-slate-100 min-h-[calc(100vh)]">
          <Outlet />
        </main>
      </div>
    </>
  );
}
export default App;
