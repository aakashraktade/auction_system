import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Premium Cricket Loader with 3D Effect
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
    background: 'linear-gradient(135deg, #0a1929 0%, #1a365d 100%)',
    zIndex: 1000,
    color: 'white',
    overflow: 'hidden'
  },
  field: {
    position: 'relative',
    width: '220px',
    height: '220px',
    perspective: '1000px',
    marginBottom: '30px'
  },
  pitch: {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
    animation: 'rotate 8s linear infinite',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bat: {
    position: 'absolute',
    width: '6px',
    height: '100px',
    background: 'linear-gradient(to bottom, #8B4513, #A0522D, #8B4513)',
    borderRadius: '4px',
    transform: 'rotateX(60deg) rotateZ(45deg)',
    transformOrigin: 'center bottom',
    animation: 'batSwing 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
    boxShadow: '0 0 15px rgba(0,0,0,0.5)',
    zIndex: 3
  },
  ball: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    background: 'radial-gradient(circle at 30% 30%, #fff, #D3A762 60%, #8B0000)',
    borderRadius: '50%',
    transform: 'translateZ(20px)',
    animation: 'ballOrbit 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
    zIndex: 2
  },
  stumps: {
    position: 'absolute',
    width: '60px',
    height: '80px',
    transformStyle: 'preserve-3d',
    animation: 'stumpRotate 15s linear infinite'
  },
  stump: {
    position: 'absolute',
    width: '6px',
    height: '80px',
    background: 'linear-gradient(to bottom, #8B4513, #5D4037, #3E2723)',
    borderRadius: '2px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
  },
  loadingText: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginTop: '40px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    background: 'linear-gradient(90deg, #fff, #FFD700, #fff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'textGlow 2s ease-in-out infinite alternate',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
  },
  particles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 1
  },
  particle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%',
    animation: 'particleFloat 4s infinite',
    opacity: 0
  }
};

// Import team logos
import cskLogo from './assets/logo/csk.png';
import dcLogo from './assets/logo/dc.jpeg';
import gtLogo from './assets/logo/gt.jpeg';
import kkrLogo from './assets/logo/kkr.png';
import lsgLogo from './assets/logo/lsg.jpeg';
import miLogo from './assets/logo/mi.jpeg';
import pkLogo from './assets/logo/pk.png';
import rcbLogo from './assets/logo/rcb.png';
import rrLogo from './assets/logo/rr.jpeg';
import srhLogo from './assets/logo/srh.jpeg';

// Team color mapping and logos
const teamData = {
  'Mumbai': { 
    bg: '#004ba0', 
    text: '#ffffff',
    logo: miLogo
  },
  'Chennai': { 
    bg: '#fdb913', 
    text: '#003366',
    logo: cskLogo
  },
  'Royal': { 
    bg: '#000000', 
    text: '#ff0000',
    logo: rcbLogo
  },
  'Kolkata': { 
    bg: '#3a225d', 
    text: '#f9a01b',
    logo: kkrLogo
  },
  'Delhi': { 
    bg: '#00008b', 
    text: '#ffffff',
    logo: dcLogo
  },
  'Rajasthan': { 
    bg: '#2d4d9d', 
    text: '#ffc100',
    logo: rrLogo
  },
  'Sunrisers': { 
    bg: '#ff822a', 
    text: '#000000',
    logo: srhLogo
  },
  'Lucknow': { 
    bg: '#0f4d8a', 
    text: '#00a6ce',
    logo: lsgLogo
  },
  'Gujarat': { 
    bg: '#1e3d8f', 
    text: '#f9a01b',
    logo: gtLogo
  },
  'Punjab': { 
    bg: '#a71c34', 
    text: '#ffffff',
    logo: pkLogo
  }
};

const TeamCard = ({ team }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Get team data
  const teamName = team.name.split(' ')[0];
  const { bg, text, logo } = teamData[teamName] || { 
    bg: '#f0f0f0', 
    text: '#333333',
    logo: null
  };
  
  // Background style with image and overlay
  const backgroundStyle = {
    background: logo 
      ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${logo})`
      : bg,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative'
  };
  return (
    <div
      style={{
        ...backgroundStyle,
        position: 'relative',
        color: '#ffffff', // White text for better contrast with dark overlay
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minHeight: "180px",
        width: "100%",
        boxSizing: "border-box",
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.4)'
        }
      }}
    >
      {/* Team Header */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '20px', 
          fontWeight: '700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          color: '#ffffff'
        }}>
          {team.name}
        </h2>
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          opacity: 0.9,
          color: '#ffffff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          Budget Left: ₹{team.budget} Cr
        </p>
      </div>

      {/* Players Dropdown */}
      <div style={{ marginTop: 'auto' }}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: '500',
            backdropFilter: 'blur(5px)'
          }}
        >
          <span>{isExpanded ? 'Hide' : 'View'} Players ({team.team_players?.length || 0})</span>
          <span style={{ fontSize: '18px' }}>{isExpanded ? '▲' : '▼'}</span>
        </button>
        
        {isExpanded && team.team_players?.length > 0 && (
          <div style={{
            marginTop: '10px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
            padding: '10px',
            maxHeight: '200px',
            overflowY: 'auto',
            backdropFilter: 'blur(5px)'
          }}>
            {team.team_players.map((tp, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx < team.team_players.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={tp.players.avatar_url}
                    alt={tp.players.name}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}
                  />
                  <div>
                    <div style={{ 
                      fontWeight: '500', 
                      fontSize: '13px',
                      color: '#fff'
                    }}>
                      {tp.players.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textTransform: 'capitalize'
                    }}>
                      {tp.role} • ₹{tp.players.sold_price} Cr
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isExpanded && (!team.team_players || team.team_players.length === 0) && (
          <div style={{
            marginTop: '10px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '13px',
            padding: '10px',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px'
          }}>
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

  // Create floating particles
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      const style = {
        ...cricketLoaderStyles.particle,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      };
      particles.push(<div key={i} style={style} />);
    }
    return particles;
  };

  if (isLoading) {
    return (
      <div style={cricketLoaderStyles.loaderContainer}>
        <style>
          {`
            @keyframes rotate {
              0% { transform: rotateY(0deg) rotateX(10deg); }
              100% { transform: rotateY(360deg) rotateX(10deg); }
            }
            @keyframes batSwing {
              0%, 100% { 
                transform: rotateX(60deg) rotateZ(45deg) rotateY(30deg);
              }
              50% { 
                transform: rotateX(60deg) rotateZ(45deg) rotateY(-30deg);
              }
            }
            @keyframes ballOrbit {
              0% { 
                transform: translateZ(20px) rotateY(0deg) translateX(60px) rotateY(0deg);
                opacity: 1;
              }
              25% { 
                transform: translateZ(20px) rotateY(90deg) translateX(60px) rotateY(-90deg);
                opacity: 0.9;
              }
              50% { 
                transform: translateZ(20px) rotateY(180deg) translateX(60px) rotateY(-180deg);
                opacity: 0.8;
              }
              75% { 
                transform: translateZ(20px) rotateY(270deg) translateX(60px) rotateY(-270deg);
                opacity: 0.9;
              }
              100% { 
                transform: translateZ(20px) rotateY(360deg) translateX(60px) rotateY(-360deg);
                opacity: 1;
              }
            }
            @keyframes stumpRotate {
              0% { transform: rotateY(0deg); }
              100% { transform: rotateY(360deg); }
            }
            @keyframes particleFloat {
              0% { 
                transform: translateY(0) translateX(0);
                opacity: 0;
              }
              10% { opacity: 0.8; }
              90% { opacity: 0.8; }
              100% { 
                transform: translateY(-100px) translateX(20px);
                opacity: 0;
              }
            }
            @keyframes textGlow {
              0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
              100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
            }
          `}
        </style>
        
        <div style={cricketLoaderStyles.field}>
          <div style={cricketLoaderStyles.pitch}>
            <div style={cricketLoaderStyles.stumps}>
              {[0, 1, 2].map((_, i) => (
                <div 
                  key={i} 
                  style={{
                    ...cricketLoaderStyles.stump,
                    left: `${i * 15 - 15}px`,
                    transform: `rotateY(${i * 90}deg) rotateX(60deg)`,
                  }} 
                />
              ))}
            </div>
            <div style={cricketLoaderStyles.bat}></div>
            <div style={cricketLoaderStyles.ball}></div>
          </div>
        </div>
        
        <div style={cricketLoaderStyles.particles}>
          {renderParticles()}
        </div>
        
        <p style={cricketLoaderStyles.loadingText}>Loading Team Squads</p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        minHeight: "100%",
        width: "100vw",
        padding: "20px",
        background: "linear-gradient(180deg, #0f2027, #203a43, #2c5364)",
        color: "white",
        boxSizing: "border-box",
        overflowX: "hidden"
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>🏆 Team Squads</h1>

      {/* Teams Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "100%"
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
        <h2 style={{ marginBottom: "20px", color: "#d32f2f" }}>❌ Unsold Players</h2>
        {unsoldPlayers.length > 0 ? (
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            margin: 0, 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "15px"
          }}>
            {unsoldPlayers.map((player) => (
              <li
                key={player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  gap: "10px"
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
          <p style={{ textAlign: "center", color: "#555" }}>All players were sold 🎉</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default AuctionResults;
