import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from 'styled-components';

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

// Team logo mapping
const teamLogos = {
  'Chennai Super Kings': cskLogo,
  'Delhi Capitals': dcLogo,
  'Gujarat Titans': gtLogo,
  'Kolkata Knight Riders': kkrLogo,
  'Lucknow Super Giants': lsgLogo,
  'Mumbai Indians': miLogo,
  'Punjab Kings': pkLogo,
  'Royal Challengers Bangalore': rcbLogo,
  'Rajasthan Royals': rrLogo,
  'Sunrisers Hyderabad': srhLogo,
  'CSK': cskLogo,
  'DC': dcLogo,
  'GT': gtLogo,
  'KKR': kkrLogo,
  'LSG': lsgLogo,
  'MI': miLogo,
  'PBKS': pkLogo,
  'RCB': rcbLogo,
  'RR': rrLogo,
  'SRH': srhLogo
};

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Add global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body, html, #root {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 2rem;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  box-sizing: border-box;
  position: relative;
`;

const Title = styled.h1`
  color: #f7fafc;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
`;

const Button = styled.button`
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PrimaryButton = styled(Button)`
  background: #3182ce;
  color: white;
  
  &:hover {
    background: #2c5282;
  }
`;

const SecondaryButton = styled(Button)`
  background: #e2e8f0;
  color: #2d3748;
  
  &:hover {
    background: #cbd5e0;
  }
`;

const DangerButton = styled(Button)`
  background: #e53e3e;
  color: white;
  
  &:hover {
    background: #c53030;
  }
`;

const PlayerCard = styled.div`
  background: #2d3748;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  margin: 1rem 0;
  animation: ${fadeIn} 0.3s ease-out;
  transition: all 0.3s ease;
  border: 1px solid #4a5568;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.4);
  }
`;

const PlayerImage = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 12px;
  object-fit: cover;
  margin: 0 auto 1rem;
  border: 4px solid #f7fafc;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const PlayerName = styled.h2`
  color: #f7fafc;
  margin: 0.5rem 0;
  font-size: 1.5rem;
`;

const PlayerMeta = styled.p`
  color: #cbd5e0;
  margin: 0.5rem 0;
  font-size: 1.1rem;
`;

const BidInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  border: 2px solid #4a5568;
  border-radius: 8px;
  margin: 1rem 0;
  transition: all 0.3s ease;
  text-align: center;
  background-color: #2d3748;
  color: #f7fafc;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  width: 100%;
  margin: 1.5rem 0;
`;

const TeamButton = styled(Button)`
  background: #2d3748;
  border: 2px solid #4a5568;
  color: #f7fafc;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4a5568;
    border-color: #718096;
    transform: translateY(-2px);
  }
`;

const TeamLogo = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 0.5rem;
  border-radius: 50%;
`;

const Auction = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teams, setTeams] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [showTeams, setShowTeams] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch players and teams
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          { data: playersData, error: playersError },
          { data: teamsData, error: teamsError }
        ] = await Promise.all([
          supabase.from("players").select("*").eq("status", "available"),
          supabase.from("teams").select("*")
        ]);

        if (!playersError) setPlayers(playersData || []);
        if (!teamsError) setTeams(teamsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        overflow: 'hidden'
      }}>
        <div style={{ 
          textAlign: 'center',
          maxWidth: '300px',
          width: '100%',
          padding: '2.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            margin: '0 auto 1.5rem'
          }}>
            <div style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(145deg, #d4a76a, #f7c48a)',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#5d3f1c',
              fontSize: '20px',
              fontWeight: 'bold',
              animation: 'pulse 1.5s infinite ease-in-out'
            }}>
              🏏
            </div>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '4px solid transparent',
              borderTopColor: '#3182ce',
              borderRightColor: '#3182ce',
              borderRadius: '50%',
              animation: 'spin 1.2s linear infinite',
            }} />
          </div>
          <h3 style={{ 
            marginBottom: '0.5rem',
            color: '#2d3748',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Loading Auction...
          </h3>
          <p style={{ 
            color: '#718096',
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}>
            Fetching players and teams
          </p>
        </div>
      </div>
    );
  }


  // Pick random player that is not the currently selected one
  const pickRandomPlayer = () => {
    if (players.length === 0) {
      alert("🎉 No more players available for auction!");
      return;
    }

    let randomPlayer;
    if (players.length === 1) {
      randomPlayer = players[0];
    } else {
      const availablePlayers = selectedPlayer 
        ? players.filter(p => p.id !== selectedPlayer.id)
        : players;
      const randomIndex = Math.floor(Math.random() * availablePlayers.length);
      randomPlayer = availablePlayers[randomIndex];
    }

    setSelectedPlayer(randomPlayer);
    setBidAmount("");
    setShowTeams(false);
  };

  // Mark Unsold
  const handleUnsold = async () => {
    if (!selectedPlayer) return;
    
    const { error } = await supabase
      .from("players")
      .update({ status: "unsold" })
      .eq("id", selectedPlayer.id);

    if (error) {
      alert("❌ Error marking player as unsold: " + error.message);
      return;
    }
    
    setPlayers(players.filter((p) => p.id !== selectedPlayer.id));
    setSelectedPlayer(null);
  };

  // Show team selection
  const handleSold = () => {
    if (!selectedPlayer) return;
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      alert("💰 Please enter a valid bid amount!");
      return;
    }
    setShowTeams(true);
  };

  // Assign player to team
  const assignPlayer = async (teamId) => {
    try {
      const { data, error } = await supabase.rpc("assign_player_to_team", {
        _player_id: selectedPlayer.id,
        _team_id: teamId,
        _amount: parseFloat(bidAmount),
      });

      if (error) throw error;
      if (!data.ok) throw new Error(data.error || "Failed to assign player");

      alert(`✅ ${selectedPlayer.name} sold for ₹${bidAmount} crores!`);
      setPlayers(players.filter((p) => p.id !== selectedPlayer.id));
      setSelectedPlayer(null);
      setShowTeams(false);
      setBidAmount("");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleAuctionOver = () => {
    if (window.confirm("Are you sure you want to end the auction?")) {
      navigate("/results");
    }
  };

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        overflow: 'hidden'
      }}>
        <div style={{ 
          textAlign: 'center',
          maxWidth: '300px',
          margin: '0 auto',
          padding: '2.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1.5rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              border: '4px solid transparent',
              borderTopColor: '#3182ce',
              borderRightColor: '#3182ce',
              borderRadius: '50%',
              animation: 'spin 1.2s linear infinite'
            }} />
          </div>
          <p style={{ 
            color: '#4a5568',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            Fetching players and teams
            <span style={{
              display: 'inline-block',
              width: '10px',
              textAlign: 'left',
              animation: 'dots 1.5s steps(5, end) infinite'
            }}>...</span>
          </p>
          <style jsx global>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spinReverse {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            @keyframes pulse {
              0% { transform: translate(-50%, -50%) scale(1); }
              50% { transform: translate(-50%, -50%) scale(1.1); }
              100% { transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes dots {
              0%, 20% { content: ''; }
              40% { content: '.'; }
              60% { content: '..'; }
              80%, 100% { content: '...'; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Check if all players are finished
  if (players.length === 0) {
    return (
      <>
        <GlobalStyle />
        <Container>
        <Title>🏆 Auction Complete! 🎉</Title>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          margin: '1rem 0'
        }}>
          <p style={{ color: '#4a5568', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            All players have been auctioned!
          </p>
          <PrimaryButton 
            onClick={() => navigate('/results')}
            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
          >
            🏆 Show Results
          </PrimaryButton>
        </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
      <Title>🏆 IPL Auction 2024</Title>
      
      <PrimaryButton 
        onClick={pickRandomPlayer}
        style={{ marginBottom: '2rem' }}
      >
        <span>🎲</span> Pick Random Player
      </PrimaryButton>

      {selectedPlayer ? (
        <PlayerCard>
          {selectedPlayer.avatar_url && (
            <PlayerImage 
              src={selectedPlayer.avatar_url} 
              alt={selectedPlayer.name} 
            />
          )}
          <PlayerName>{selectedPlayer.name}</PlayerName>
          <PlayerMeta>🏏 {selectedPlayer.role || 'All-rounder'}</PlayerMeta>
          <PlayerMeta>🏆 Last Year: {selectedPlayer.last_year_team || 'N/A'}</PlayerMeta>
          <PlayerMeta>💰 Base Price: ₹{selectedPlayer.base_price || '2.0'} Cr</PlayerMeta>

          <BidInput
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter bid amount (in Cr)"
            min={selectedPlayer.base_price || 2}
            step="0.5"
          />
          
          <div style={{ margin: '1rem 0' }}>
            <p style={{ margin: '0.5rem 0', color: '#4a5568' }}>Quick Bid:</p>
            <ButtonGroup>
              <SecondaryButton onClick={() => setBidAmount(prev => (Number(prev) || 0) + 0.5)}>
                +50 Lakh
              </SecondaryButton>
              <SecondaryButton onClick={() => setBidAmount(prev => (Number(prev) || 0) + 1)}>
                +1 Cr
              </SecondaryButton>
              <SecondaryButton onClick={() => setBidAmount(prev => (Number(prev) || 0) + 2)}>
                +2 Cr
              </SecondaryButton>
            </ButtonGroup>
          </div>
          
          <ButtonGroup style={{ marginTop: '1.5rem' }}>
            <PrimaryButton onClick={handleSold}>
              ✅ Sold
            </PrimaryButton>
            <DangerButton onClick={handleUnsold}>
              ❌ Unsold
            </DangerButton>
          </ButtonGroup>

          {showTeams && (
            <div 
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                zIndex: 1000
              }}
              onClick={() => setShowTeams(false)}
            >
              <div 
                style={{ 
                  background: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '16px',
                  width: '90%',
                  maxWidth: '500px',
                  maxHeight: '90vh',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ 
                  color: '#2d3748', 
                  marginBottom: '1.5rem', 
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  Assign to Team
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '0.5rem'
                }}>
                  {teams.map((team) => {
                    const teamLogo = teamLogos[team.name] || teamLogos[team.name.split(' ').map(word => word[0]).join('')];
                    return (
                      <div 
                        key={team.id}
                        onClick={() => assignPlayer(team.id)}
                        style={{
                          position: 'relative',
                          height: '100px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          ':hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
                          }
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundImage: teamLogo ? `url(${teamLogo})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          filter: 'brightness(0.7)',
                          zIndex: 1
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                          zIndex: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '1rem',
                          textAlign: 'center',
                          padding: '0.5rem',
                          textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                        }}>
                          {team.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <button
                    onClick={() => setShowTeams(false)}
                    style={{
                      padding: '8px 16px',
                      background: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </PlayerCard>
      ) : (
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          margin: '1rem 0'
        }}>
          <p style={{ color: '#4a5568', marginBottom: '1.5rem' }}>
            {players.length > 0 
              ? 'Click the button below to select a random player'
              : 'No more players available for auction'}
          </p>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>
            {players.length} players remaining
          </p>
        </div>
      )}

      {players.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <DangerButton 
            onClick={handleAuctionOver}
            style={{ 
              padding: '12px 24px', 
              fontSize: '1rem',
              margin: '0 auto'
            }}
          >
            🚨 End Auction Early
          </DangerButton>
        </div>
      )}
      </Container>
    </>
  );
};

export default Auction;
