import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Modern Cricket Loader with Smooth Animations
const cricketLoaderStyles = {
  loaderContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    zIndex: 1000,
    overflow: 'hidden',
  },
  cricketPitch: {
    width: '200px',
    height: '100px',
    backgroundColor: '#2c3e50',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '2px',
      background: 'rgba(255, 255, 255, 0.1)',
    },
  },
  pitchLine: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '60px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
  },
  ball: {
    position: 'absolute',
    width: '14px',
    height: '14px',
    background: 'radial-gradient(circle at 30% 30%, #fff, #D3A762 60%, #8B0000)',
    borderRadius: '50%',
    top: '50%',
    left: '10%',
    transform: 'translateY(-50%)',
    boxShadow: '0 0 10px rgba(210, 180, 100, 0.8)',
    animation: 'ballMove 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
  },
  bat: {
    position: 'absolute',
    width: '80px',
    height: '8px',
    background: 'linear-gradient(to right, #8B4513, #A0522D, #8B4513)',
    borderRadius: '4px',
    top: '50%',
    right: '15%',
    transform: 'translateY(-50%) rotate(-30deg)',
    transformOrigin: 'right center',
    animation: 'batSwing 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
    zIndex: 2,
  },
  stumps: {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '4px',
  },
  stump: {
    width: '4px',
    height: '30px',
    background: 'linear-gradient(to bottom, #8B4513, #5D4037)',
    borderRadius: '2px',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-3px',
      right: '-3px',
      height: '6px',
      background: 'linear-gradient(to right, #8B4513, #D2B48C, #8B4513)',
      borderRadius: '3px',
    },
  },
  loadingText: {
    marginTop: '40px',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    position: 'relative',
    '&::after': {
      content: '".  "',
      display: 'inline-block',
      width: '20px',
      textAlign: 'left',
      animation: 'dotPulse 1.5s infinite',
    },
  },
  loaderParticles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: '3px',
    height: '3px',
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '50%',
    opacity: 0,
  },
  keyframes: {
    ballMove: {
      '0%': { left: '10%', transform: 'translateY(-50%) scale(1)' },
      '40%': { left: '50%', transform: 'translateY(-50%) scale(1.2)' },
      '60%': { left: '50%', transform: 'translateY(-50%) scale(1.2)' },
      '100%': { left: '90%', transform: 'translateY(-50%) scale(1)' },
    },
    batSwing: {
      '0%, 100%': { transform: 'translateY(-50%) rotate(-30deg)' },
      '50%': { transform: 'translateY(-50%) rotate(30deg) translateX(10px)' },
    },
    dotPulse: {
      '0%, 100%': { opacity: 0 },
      '50%': { opacity: 1 },
    },
  },
  createParticles: (count) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `particleFloat ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`,
      });
    }
    return particles;
  },
};

// Import team logos
import cskLogo from "./assets/logo/csk.png";
import dcLogo from "./assets/logo/dc.jpeg";
import gtLogo from "./assets/logo/gt.jpeg";
import kkrLogo from "./assets/logo/kkr.png";
import lsgLogo from "./assets/logo/lsg.jpeg";
import miLogo from "./assets/logo/mi.jpeg";
import pkLogo from "./assets/logo/pk.png";
import rcbLogo from "./assets/logo/rcb.png";
import rrLogo from "./assets/logo/rr.jpeg";
import srhLogo from "./assets/logo/srh.jpeg";

// Team color mapping and logos
const teamData = {
  Mumbai: {
    bg: "#004ba0",
    text: "#ffffff",
    logo: miLogo,
  },
  Chennai: {
    bg: "#fdb913",
    text: "#003366",
    logo: cskLogo,
  },
  Royal: {
    bg: "#000000",
    text: "#ff0000",
    logo: rcbLogo,
  },
  Kolkata: {
    bg: "#3a225d",
    text: "#f9a01b",
    logo: kkrLogo,
  },
  Delhi: {
    bg: "#00008b",
    text: "#ffffff",
    logo: dcLogo,
  },
  Rajasthan: {
    bg: "#2d4d9d",
    text: "#ffc100",
    logo: rrLogo,
  },
  Sunrisers: {
    bg: "#ff822a",
    text: "#000000",
    logo: srhLogo,
  },
  Lucknow: {
    bg: "#0f4d8a",
    text: "#00a6ce",
    logo: lsgLogo,
  },
  Gujarat: {
    bg: "#1e3d8f",
    text: "#f9a01b",
    logo: gtLogo,
  },
  Punjab: {
    bg: "#a71c34",
    text: "#ffffff",
    logo: pkLogo,
  },
};

const TeamCard = ({ team }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Get team data
  const teamName = team.name.split(" ")[0];
  const { bg, text, logo } = teamData[teamName] || {
    bg: "#f0f0f0",
    text: "#333333",
    logo: null,
  };

  // Background style with image and overlay
  const backgroundStyle = {
    background: logo
      ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${logo})`
      : bg,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  };
  return (
    <div
      style={{
        ...backgroundStyle,
        position: "relative",
        color: "#ffffff", // White text for better contrast with dark overlay
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minHeight: "180px",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
        },
      }}
    >
      {/* Team Header */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2
          style={{
            margin: "0 0 8px 0",
            fontSize: "20px",
            fontWeight: "700",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            color: "#ffffff",
          }}
        >
          {team.name}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            opacity: 0.9,
            color: "#ffffff",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          Budget Left: ₹{team.budget} Cr
        </p>
      </div>

      {/* Players Dropdown */}
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
            fontWeight: "500",
            backdropFilter: "blur(5px)",
          }}
        >
          <span>
            {isExpanded ? "Hide" : "View"} Players (
            {team.team_players?.length || 0})
          </span>
          <span style={{ fontSize: "18px" }}>{isExpanded ? "▲" : "▼"}</span>
        </button>

        {isExpanded && team.team_players?.length > 0 && (
          <div
            style={{
              marginTop: "10px",
              background: "rgba(0, 0, 0, 0.4)",
              borderRadius: "8px",
              padding: "10px",
              maxHeight: "200px",
              overflowY: "auto",
              backdropFilter: "blur(5px)",
            }}
          >
            {team.team_players.map((tp, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom:
                    idx < team.team_players.length - 1
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "none",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src={tp.players.avatar_url}
                    alt={tp.players.name}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "13px",
                        color: "#fff",
                      }}
                    >
                      {tp.players.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(255, 255, 255, 0.8)",
                        textTransform: "capitalize",
                      }}
                    >
                      {tp.role} • ₹{tp.players.sold_price} Cr
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isExpanded &&
          (!team.team_players || team.team_players.length === 0) && (
            <div
              style={{
                marginTop: "10px",
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "13px",
                padding: "10px",
                textAlign: "center",
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "6px",
              }}
            >
              No players in this team yet
            </div>
          )}
      </div>
    </div>
  );
};

const AuctionResults = () => {
  const [teams, setTeams] = useState([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const { data: teamData } = await supabase
          .from("teams")
          .select(
            "id, name, budget, team_players(player_id, role, players(id, name, sold_price, avatar_url))"
          )
          .order("name");

        setTeams(teamData || []);

        const { data: playersData } = await supabase
          .from("players")
          .select("id, name, avatar_url")
          .is("sold_price", null);

        setUnsoldPlayers(playersData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Loading Spinner Component
  const LoadingSpinner = () => {
    // Generate particles
    const particles = cricketLoaderStyles.createParticles(15);

    return (
      <div style={cricketLoaderStyles.loaderContainer}>
        <div style={cricketLoaderStyles.cricketPitch}>
          <div style={cricketLoaderStyles.pitchLine}></div>
          <div style={cricketLoaderStyles.ball}></div>
          <div style={cricketLoaderStyles.bat}></div>
          <div style={cricketLoaderStyles.stumps}>
            <div style={cricketLoaderStyles.stump}></div>
            <div style={cricketLoaderStyles.stump}></div>
            <div style={cricketLoaderStyles.stump}></div>
          </div>
        </div>
        <div style={cricketLoaderStyles.loadingText}>
          Loading Auction Data
        </div>
        <div style={cricketLoaderStyles.loaderParticles}>
          {particles.map((particle, index) => (
            <div
              key={index}
              style={{
                ...cricketLoaderStyles.particle,
                left: particle.left,
                top: particle.top,
                animation: particle.animation,
              }}
            ></div>
          ))}
        </div>
        <style jsx global>{`
          @keyframes ballMove {
            0% { left: 10%; transform: translateY(-50%) scale(1); }
            40% { left: 50%; transform: translateY(-50%) scale(1.2); }
            60% { left: 50%; transform: translateY(-50%) scale(1.2); }
            100% { left: 90%; transform: translateY(-50%) scale(1); }
          }
          @keyframes batSwing {
            0%, 100% { transform: translateY(-50%) rotate(-30deg); }
            50% { transform: translateY(-50%) rotate(30deg) translateX(10px); }
          }
          @keyframes dotPulse {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
          @keyframes particleFloat {
            0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { 
              transform: translate(
                ${Math.random() * 100 - 50}px, 
                -${100 + Math.random() * 50}px
              ) scale(1.5); 
              opacity: 0; 
            }
          }
        `}</style>
      </div>
    );
  };

  // Show loading spinner when data is being fetched
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        minHeight: "100%",
        width: "100%",
        padding: "20px",
        background: "linear-gradient(180deg, #0f2027, #203a43, #2c5364)",
        color: "white",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          🏆 Team Squads
        </h1>

        {/* Teams Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>

        <div
          style={{
            marginTop: "50px",
            background: "linear-gradient(180deg, #0f2027, #203a43, #2c5364)",
            borderRadius: "12px",
            color: "white",
            width: "100%",
            padding: "20px",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#d32f2f" }}>
            ❌ Unsold Players
          </h2>
          {unsoldPlayers.length > 0 ? (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "15px",
              }}
            >
              {unsoldPlayers.map((player) => (
                <li
                  key={player.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    gap: "10px",
                  }}
                >
                  <img
                    src={player.avatar_url}
                    alt={player.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #d32f2f",
                    }}
                  />
                  <span style={{ fontWeight: "500" }}>{player.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: "center", color: "#555" }}>
              All players were sold 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionResults;
