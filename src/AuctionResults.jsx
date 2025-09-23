import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuctionResults = () => {
  const [teams, setTeams] = useState([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      // Fetch teams with their players
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select(
          "id, name, budget, team_players(player_id, role, players(name, sold_price, avatar_url))"
        );

      if (teamError) console.error(teamError);
      else setTeams(teamData || []);

      // Fetch unsold players
      const { data: unsoldData, error: unsoldError } = await supabase
        .from("players")
        .select("id, name, avatar_url")
        .eq("status", "unsold"); // <-- changed to "unsold"

      if (unsoldError) console.error(unsoldError);
      else setUnsoldPlayers(unsoldData || []);
    };

    fetchResults();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1976d2", marginBottom: "30px" }}>🏆 Auction Results</h1>

      {/* Teams Section */}
      <div style={{ width: "100%", maxWidth: "800px" }}>
        {teams.map((team) => (
          <div
            key={team.id}
            style={{
              marginBottom: "30px",
              borderRadius: "12px",
              background: "white",
              padding: "20px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginBottom: "15px" }}>
              {team.name} <span style={{ fontSize: "16px", color: "#555" }}>(Budget Left: ₹{team.budget} Cr)</span>
            </h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {team.team_players.length > 0 ? (
                team.team_players.map((tp, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "12px",
                      gap: "10px",
                    }}
                  >
                    <img
                      src={tp.players.avatar_url}
                      alt={tp.players.name}
                      style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid #1976d2" }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <span style={{ fontWeight: "500" }}>{tp.players.name}</span>
                      <span style={{ fontSize: "14px", color: "#555" }}>
                        💰 {tp.players.sold_price} Cr | Role: {tp.role}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p style={{ color: "#999" }}>No players assigned</p>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Unsold Players Section */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: "40px",
          borderRadius: "12px",
          background: "white",
          padding: "20px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#d32f2f" }}>❌ Unsold Players</h2>
        {unsoldPlayers.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {unsoldPlayers.map((player) => (
              <li
                key={player.id}
                style={{ display: "flex", alignItems: "center", marginBottom: "12px", gap: "10px" }}
              >
                <img
                  src={player.avatar_url}
                  alt={player.name}
                  style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid #d32f2f" }}
                />
                <span style={{ fontWeight: "500" }}>{player.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: "center", color: "#555" }}>All players were sold 🎉</p>
        )}
      </div>
    </div>
  );
};

export default AuctionResults;
