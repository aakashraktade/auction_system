import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

const Auction = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teams, setTeams] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [showTeams, setShowTeams] = useState(false);

  const navigate = useNavigate();

  // Fetch players and teams
  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("status", "available");
      if (!error) setPlayers(data || []);
    };

    const fetchTeams = async () => {
      const { data, error } = await supabase.from("teams").select("*");
      if (!error) setTeams(data || []);
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  // Pick random player that is not the currently selected one
  const pickRandomPlayer = () => {
    if (players.length === 0) {
      alert("No more available players!");
      return;
    }

    let randomPlayer;
    if (players.length === 1) {
      randomPlayer = players[0]; // only one left
    } else {
      do {
        const randomIndex = Math.floor(Math.random() * players.length);
        randomPlayer = players[randomIndex];
      } while (selectedPlayer && randomPlayer.id === selectedPlayer.id);
    }

    setSelectedPlayer(randomPlayer);
    setBidAmount("");
    setShowTeams(false);
  };

  // Mark Unsold
  const handleUnsold = async () => {
    if (!selectedPlayer) return;
    await supabase.from("players").update({ status: "unsold" }).eq("id", selectedPlayer.id);
    setPlayers(players.filter((p) => p.id !== selectedPlayer.id));
    setSelectedPlayer(null);
  };

  // Show team selection
  const handleSold = () => {
    if (!selectedPlayer || !bidAmount) {
      alert("Enter bid amount first!");
      return;
    }
    setShowTeams(true);
  };

  // Assign player to team
  const assignPlayer = async (teamId) => {
    const { data, error } = await supabase.rpc("assign_player_to_team", {
      _player_id: selectedPlayer.id,
      _team_id: teamId,
      _amount: parseFloat(bidAmount),
    });

    if (error) {
      alert("Error: " + error.message);
    } else if (!data.ok) {
      alert("Error: " + data.error);
    } else {
      alert(`${selectedPlayer.name} assigned to team!`);
      setPlayers(players.filter((p) => p.id !== selectedPlayer.id));
      setSelectedPlayer(null);
      setShowTeams(false);
    }
  };

  const handleAuctionOver = () => {
    navigate("/results");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ marginBottom: "20px", color: "#1976d2" }}>🏆 Auction System</h1>

      {/* Always visible Pick Random Player button */}
      <button
        onClick={pickRandomPlayer}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Pick Random Player
      </button>

      {selectedPlayer && (
  <div
    style={{
      padding: "20px",
      borderRadius: "10px",
      background: "white",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      width: "320px",
    }}
  >
    <h2>{selectedPlayer.name}</h2>
    {selectedPlayer.avatar_url && (
      <img
        src={selectedPlayer.avatar_url}
        alt={selectedPlayer.name}
        width={150}
        height={150}
        style={{ borderRadius: "8px", objectFit: "cover", marginBottom: "10px" }}
      />
    )}
    <p>Last Year Team: {selectedPlayer.last_year_team}</p>

    {/* Bidding Buttons */}
<div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
  <button
    onClick={() => setBidAmount((prev) => Number(prev || 0) + 0.5)}
    style={{
      padding: "8px 12px",
      background: "#1976d2",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    +50 Lakh
  </button>
  <button
    onClick={() => setBidAmount((prev) => Number(prev || 0) + 1)}
    style={{
      padding: "8px 12px",
      background: "#1976d2",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    +1 Cr
  </button>
</div>

{/* Bid Input */}
<input
  type="number"
  step="0.1"
  placeholder="Enter bid amount"
  value={bidAmount}
  onChange={(e) => setBidAmount(e.target.value)}
  style={{
    padding: "8px",
    marginTop: "10px",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
  }}
/>


    <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
      <button
        onClick={handleSold}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sold
      </button>
      <button
        onClick={handleUnsold}
        style={{
          padding: "10px 20px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Unsold
      </button>
    </div>
  </div>
)}


      {showTeams && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
    onClick={() => setShowTeams(false)} // click outside closes modal
  >
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "20px",
        width: "300px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      <h3>Select a Team for {selectedPlayer?.name}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {teams.map((team) => (
          <li key={team.id} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => assignPlayer(team.id)}
              style={{
                width: "100%",
                padding: "10px",
                background: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {team.name} (₹{team.budget} Cr left)
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setShowTeams(false)}
        style={{
          marginTop: "10px",
          padding: "8px 12px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

      <hr style={{ margin: "30px 0", width: "100%", maxWidth: "600px" }} />

      <button
        onClick={handleAuctionOver}
        style={{
          padding: "12px 24px",
          background: "darkred",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        🚨 Auction Over
      </button>
    </div>
  );
};

export default Auction;
