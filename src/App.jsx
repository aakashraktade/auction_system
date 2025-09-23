import { Routes, Route } from "react-router-dom";
import Auction from "./Auction";
import AuctionResults from "./AuctionResults";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auction />} />
      <Route path="/results" element={<AuctionResults />} />
    </Routes>
  );
}

export default App;
