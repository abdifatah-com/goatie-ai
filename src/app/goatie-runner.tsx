"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, RotateCcw, Trophy, Zap, Sparkles } from "lucide-react";

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "cactus" | "rock" | "drone";
}

interface StarToken {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  pulse: number;
}

interface FloatingText {
  text: string;
  x: number;
  y: number;
  opacity: number;
  color: string;
}

export default function GoatieRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // High score persisted in localStorage
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDoubleJumpReady, setIsDoubleJumpReady] = useState<boolean>(false);
  const [tokensCollected, setTokensCollected] = useState<number>(0);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound Synthesizer via Web Audio API (Zero external assets needed)
  const playBeep = useCallback((freqStart: number, freqEnd: number, duration: number, type: OscillatorType = "square") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 10), ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked before user gesture
    }
  }, [soundEnabled]);

  const soundJump = useCallback(() => playBeep(220, 520, 0.12, "square"), [playBeep]);
  const soundDoubleJump = useCallback(() => playBeep(380, 780, 0.14, "square"), [playBeep]);
  const soundToken = useCallback(() => playBeep(587, 880, 0.18, "sine"), [playBeep]);
  const soundHit = useCallback(() => playBeep(280, 40, 0.25, "sawtooth"), [playBeep]);

  // Load high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("goatie_runner_highscore");
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch {
      // localStorage disabled or private mode
    }
  }, []);

  // Internal game engine state ref (accessed inside requestAnimationFrame loop)
  const engineRef = useRef({
    player: {
      x: 55,
      y: 136, // ground baseline is y=136 (ground line at 170)
      width: 34,
      height: 34,
      vy: 0,
      isGrounded: true,
      jumpsLeft: 2,
      runCycle: 0,
    },
    groundY: 170,
    obstacles: [] as Obstacle[],
    tokens: [] as StarToken[],
    floatingTexts: [] as FloatingText[],
    clouds: [
      { x: 120, y: 35, speed: 0.4, w: 48 },
      { x: 380, y: 25, speed: 0.6, w: 60 },
      { x: 550, y: 45, speed: 0.5, w: 40 },
    ],
    groundPebbles: [
      { x: 30, y: 178, w: 8 },
      { x: 110, y: 184, w: 12 },
      { x: 230, y: 176, w: 6 },
      { x: 350, y: 182, w: 14 },
      { x: 480, y: 178, w: 10 },
      { x: 590, y: 185, w: 8 },
    ],
    score: 0,
    highScore: 0,
    tokensCount: 0,
    speed: 4.8,
    distanceTimer: 0,
    spawnTimer: 0,
    nextSpawnDistance: 90,
    tokenSpawnTimer: 0,
    state: "idle" as "idle" | "playing" | "gameover",
    shake: 0,
    goatImage: null as HTMLImageElement | null,
  });

  // Preload mascot image
  useEffect(() => {
    const img = new Image();
    img.src = "/goat.png";
    img.onload = () => {
      engineRef.current.goatImage = img;
    };
  }, []);

  // Sync high score to engine
  useEffect(() => {
    engineRef.current.highScore = highScore;
  }, [highScore]);

  // Jump action
  const triggerJump = useCallback(() => {
    const eng = engineRef.current;
    if (eng.state === "idle" || eng.state === "gameover") {
      // Start or Restart game
      eng.state = "playing";
      eng.score = 0;
      eng.tokensCount = 0;
      eng.speed = 4.8;
      eng.obstacles = [];
      eng.tokens = [];
      eng.floatingTexts = [];
      eng.player.y = 136;
      eng.player.vy = -11.5;
      eng.player.isGrounded = false;
      eng.player.jumpsLeft = 1;
      setGameState("playing");
      setScore(0);
      setTokensCollected(0);
      setIsDoubleJumpReady(true);
      soundJump();
      return;
    }

    if (eng.state === "playing") {
      if (eng.player.isGrounded) {
        // First jump
        eng.player.vy = -11.5;
        eng.player.isGrounded = false;
        eng.player.jumpsLeft = 1;
        setIsDoubleJumpReady(true);
        soundJump();
      } else if (eng.player.jumpsLeft > 0) {
        // Double jump!
        eng.player.vy = -10.2;
        eng.player.jumpsLeft = 0;
        setIsDoubleJumpReady(false);
        soundDoubleJump();
        // Add double jump spark text
        eng.floatingTexts.push({
          text: "DOUBLE JUMP!",
          x: eng.player.x,
          y: eng.player.y - 12,
          opacity: 1,
          color: "#0f380f",
        });
      }
    }
  }, [soundJump, soundDoubleJump]);

  // Main 60fps Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const eng = engineRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // ── 1. Logic Update ──
      if (eng.state === "playing") {
        // Increase score by distance
        eng.distanceTimer += 1;
        if (eng.distanceTimer % 5 === 0) {
          eng.score += 1;
          setScore(eng.score);

          // Speed up slightly every 120 points
          if (eng.score % 120 === 0 && eng.speed < 9.5) {
            eng.speed += 0.35;
            eng.floatingTexts.push({
              text: "SPEED UP! ⚡",
              x: W / 2 - 40,
              y: 70,
              opacity: 1,
              color: "#0f380f",
            });
          }
        }

        // Apply Player Gravity & Physics
        eng.player.vy += 0.68;
        eng.player.y += eng.player.vy;

        // Ground collision
        if (eng.player.y >= 136) {
          eng.player.y = 136;
          eng.player.vy = 0;
          eng.player.isGrounded = true;
          eng.player.jumpsLeft = 2;
          setIsDoubleJumpReady(false);
        }

        // Animate legs run cycle
        eng.player.runCycle += 0.25;

        // Move background clouds
        eng.clouds.forEach((c) => {
          c.x -= c.speed;
          if (c.x < -c.w) c.x = W + Math.random() * 80;
        });

        // Move ground pebbles
        eng.groundPebbles.forEach((p) => {
          p.x -= eng.speed * 0.8;
          if (p.x < -p.w) p.x = W + Math.random() * 40;
        });

        // Spawn Obstacles
        eng.spawnTimer += 1;
        if (eng.spawnTimer > eng.nextSpawnDistance) {
          eng.spawnTimer = 0;
          eng.nextSpawnDistance = 65 + Math.floor(Math.random() * 60);

          const r = Math.random();
          if (r < 0.45) {
            // Single Rock Crate
            eng.obstacles.push({
              x: W + 10,
              y: 142,
              width: 22,
              height: 28,
              type: "cactus",
            });
          } else if (r < 0.8) {
            // Double Rock Block
            eng.obstacles.push({
              x: W + 10,
              y: 136,
              width: 32,
              height: 34,
              type: "rock",
            });
          } else {
            // Low floating AI drone
            eng.obstacles.push({
              x: W + 10,
              y: 110,
              width: 24,
              height: 22,
              type: "drone",
            });
          }
        }

        // Move & Filter Obstacles
        for (let i = eng.obstacles.length - 1; i >= 0; i--) {
          const obs = eng.obstacles[i];
          obs.x -= eng.speed;

          // AABB Collision Detection (with friendly 3px inner padding)
          const px = eng.player.x + 4;
          const py = eng.player.y + 4;
          const pw = eng.player.width - 8;
          const ph = eng.player.height - 8;

          const ox = obs.x + 3;
          const oy = obs.y + 3;
          const ow = obs.width - 6;
          const oh = obs.height - 6;

          if (px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy) {
            // Collision! Game Over
            eng.state = "gameover";
            eng.shake = 16;
            setGameState("gameover");
            soundHit();

            // Check high score
            if (eng.score > eng.highScore) {
              eng.highScore = eng.score;
              setHighScore(eng.score);
              try {
                localStorage.setItem("goatie_runner_highscore", String(eng.score));
              } catch {}
            }
          }

          if (obs.x < -60) {
            eng.obstacles.splice(i, 1);
          }
        }

        // Spawn Collectible Star Tokens
        eng.tokenSpawnTimer += 1;
        if (eng.tokenSpawnTimer > 180) {
          eng.tokenSpawnTimer = 0;
          eng.tokens.push({
            x: W + 20,
            y: 85 + Math.random() * 35, // reachable in air
            width: 18,
            height: 18,
            collected: false,
            pulse: 0,
          });
        }

        // Move & Check Tokens
        for (let i = eng.tokens.length - 1; i >= 0; i--) {
          const t = eng.tokens[i];
          t.x -= eng.speed;
          t.pulse += 0.08;

          // Check pickup
          const px = eng.player.x;
          const py = eng.player.y;
          const pw = eng.player.width;
          const ph = eng.player.height;

          if (!t.collected && px < t.x + t.width && px + pw > t.x && py < t.y + t.height && py + ph > t.y) {
            t.collected = true;
            eng.score += 50;
            eng.tokensCount += 1;
            setScore(eng.score);
            setTokensCollected(eng.tokensCount);
            soundToken();
            eng.floatingTexts.push({
              text: "+50 ★",
              x: t.x,
              y: t.y,
              opacity: 1,
              color: "#0f380f",
            });
            eng.tokens.splice(i, 1);
          } else if (t.x < -30) {
            eng.tokens.splice(i, 1);
          }
        }
      }

      // Update Floating texts
      for (let i = eng.floatingTexts.length - 1; i >= 0; i--) {
        const ft = eng.floatingTexts[i];
        ft.y -= 0.8;
        ft.opacity -= 0.025;
        if (ft.opacity <= 0) eng.floatingTexts.splice(i, 1);
      }

      // Screen shake damping
      let offsetX = 0;
      let offsetY = 0;
      if (eng.shake > 0) {
        offsetX = (Math.random() - 0.5) * eng.shake;
        offsetY = (Math.random() - 0.5) * eng.shake;
        eng.shake *= 0.82;
        if (eng.shake < 0.5) eng.shake = 0;
      }

      // ── 2. Canvas Render ──
      ctx.save();
      ctx.translate(offsetX, offsetY);

      // Background GameBoy LCD green
      ctx.fillStyle = "#9bbc0f";
      ctx.fillRect(0, 0, W, H);

      // Draw subtle clouds
      ctx.fillStyle = "#8bac0f";
      eng.clouds.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
        ctx.arc(c.x + 16, c.y - 4, 18, 0, Math.PI * 2);
        ctx.arc(c.x + 32, c.y, 14, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ground Base line
      ctx.strokeStyle = "#0f380f";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, eng.groundY);
      ctx.lineTo(W, eng.groundY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Ground Track area
      ctx.fillStyle = "#8bac0f";
      ctx.fillRect(0, eng.groundY + 1, W, H - eng.groundY);

      // Ground pebbles
      ctx.fillStyle = "#306230";
      eng.groundPebbles.forEach((p) => {
        ctx.fillRect(p.x, p.y, p.w, 3);
      });

      // Draw Obstacles
      ctx.fillStyle = "#0f380f";
      eng.obstacles.forEach((obs) => {
        if (obs.type === "cactus") {
          // Sharp Rock Crate
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 4);
          ctx.fill();
          // Inner detail
          ctx.fillStyle = "#8bac0f";
          ctx.fillRect(obs.x + 4, obs.y + 6, obs.width - 8, 3);
          ctx.fillStyle = "#0f380f";
        } else if (obs.type === "rock") {
          // Wide Double Rock
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 6);
          ctx.fill();
          ctx.fillStyle = "#8bac0f";
          ctx.fillRect(obs.x + 6, obs.y + 8, obs.width - 12, 4);
          ctx.fillRect(obs.x + 10, obs.y + 18, obs.width - 20, 3);
          ctx.fillStyle = "#0f380f";
        } else {
          // Glitch Drone with wings
          ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, obs.height - 8);
          ctx.fillRect(obs.x, obs.y + 8, obs.width, 4);
        }
      });

      // Draw Star Tokens
      eng.tokens.forEach((t) => {
        ctx.save();
        ctx.translate(t.x + t.width / 2, t.y + t.height / 2 + Math.sin(t.pulse) * 3);
        ctx.fillStyle = "#0f380f";
        ctx.beginPath();
        // Star shape
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * 8, -Math.sin(((18 + i * 72) * Math.PI) / 180) * 8);
          ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * 4, -Math.sin(((54 + i * 72) * Math.PI) / 180) * 4);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // Draw Goatie Character
      const p = eng.player;
      if (eng.goatImage) {
        ctx.save();
        ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
        // Tilt slightly if jumping
        if (!p.isGrounded) {
          ctx.rotate(p.vy * 0.03);
        }
        ctx.drawImage(eng.goatImage, -p.width / 2, -p.height / 2, p.width, p.height);

        // Draw running dust particles when grounded
        if (p.isGrounded && eng.state === "playing" && Math.sin(p.runCycle * 2) > 0.4) {
          ctx.fillStyle = "#306230";
          ctx.fillRect(-p.width / 2 - 4, p.height / 2 - 3, 3, 3);
          ctx.fillRect(-p.width / 2 - 8, p.height / 2 - 5, 2, 2);
        }
        ctx.restore();
      } else {
        // Fallback pixel box if image loading
        ctx.fillStyle = "#0f380f";
        ctx.fillRect(p.x, p.y, p.width, p.height);
      }

      // Draw Floating Popups
      eng.floatingTexts.forEach((ft) => {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.opacity);
        ctx.font = "bold 12px monospace";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1.0;
      });

      // ── Game State Overlays ──
      if (eng.state === "idle") {
        ctx.fillStyle = "rgba(155, 188, 15, 0.75)";
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = "#0f380f";
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GOATIE RUNNER 2.0", W / 2, 75);

        ctx.font = "bold 12px monospace";
        ctx.fillText("TAP OR PRESS SPACE TO START", W / 2, 105);

        ctx.font = "11px monospace";
        ctx.fillText("DOUBLE JUMP IN AIR • COLLECT ★ TOKENS", W / 2, 130);
        ctx.textAlign = "start";
      } else if (eng.state === "gameover") {
        ctx.fillStyle = "rgba(15, 56, 15, 0.7)";
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = "#9bbc0f";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, 65);

        ctx.font = "bold 13px monospace";
        ctx.fillText(`SCORE: ${eng.score}   ★ TOKENS: ${eng.tokensCount}`, W / 2, 95);

        if (eng.score >= eng.highScore && eng.score > 0) {
          ctx.fillText("🏆 NEW HIGH SCORE! 🏆", W / 2, 120);
        } else {
          ctx.fillText(`BEST SCORE: ${eng.highScore}`, W / 2, 120);
        }

        ctx.font = "bold 12px monospace";
        ctx.fillStyle = "#8bac0f";
        ctx.fillText("TAP SCREEN OR PRESS JUMP TO RETRY", W / 2, 150);
        ctx.textAlign = "start";
      }

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [soundHit, soundToken]);

  // Keyboard controls listener (Spacebar, ArrowUp, W)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        triggerJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerJump]);

  return (
    <div className="goatie-gameboy-wrapper" ref={containerRef}>
      {/* Handheld GameBoy Console Housing */}
      <div className="gameboy-chassis">
        {/* Top Header Bar */}
        <div className="gameboy-top-bezel">
          <div className="gameboy-battery-indicator">
            <span className={`battery-dot ${gameState === "playing" ? "active" : ""}`} />
            <span>BATTERY</span>
          </div>

          <div className="gameboy-model-title">
            <span>GOATIE POCKET • 8-BIT RUNNER</span>
          </div>

          <button
            type="button"
            className="gameboy-audio-toggle"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? "Mute audio" : "Enable 8-bit sound"}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{soundEnabled ? "SND" : "MUT"}</span>
          </button>
        </div>

        {/* LCD Screen Display */}
        <div
          className="gameboy-screen-frame"
          onClick={triggerJump}
          role="button"
          tabIndex={0}
          aria-label="Click to jump"
        >
          {/* LCD Scanlines layer */}
          <div className="gameboy-scanlines" />

          {/* Top HUD */}
          <div className="gameboy-live-hud">
            <span className="hud-label">
              <Zap size={11} style={{ marginRight: 3, verticalAlign: -1 }} />
              SCORE: {score.toString().padStart(4, "0")}
            </span>

            <span className="hud-label tokens">
              <Sparkles size={11} style={{ marginRight: 3, verticalAlign: -1 }} />
              ★ {tokensCollected}
            </span>

            <span className="hud-label high">
              <Trophy size={11} style={{ marginRight: 3, verticalAlign: -1 }} />
              HI: {highScore.toString().padStart(4, "0")}
            </span>
          </div>

          {/* Canvas Viewport */}
          <canvas
            ref={canvasRef}
            width={640}
            height={200}
            className="gameboy-canvas"
          />
        </div>

        {/* Bottom Hardware Bezel */}
        <div className="gameboy-bottom-bezel">
          <div className="gameboy-brand-label">
            <span>DOT MATRIX WITH STEREO SOUND</span>
          </div>
        </div>
      </div>

      {/* Tactile Arcade Buttons Controls Bar */}
      <div className="gameboy-controls-dock">
        {/* Jump Button (Primary Action) */}
        <button
          type="button"
          onClick={triggerJump}
          className="arcade-btn-primary"
          aria-label="Jump or Start"
        >
          {gameState === "gameover" ? (
            <>
              <RotateCcw size={15} />
              <span>RESTART RUN (A)</span>
            </>
          ) : isDoubleJumpReady ? (
            <>
              <Zap size={15} />
              <span>DOUBLE JUMP! (A)</span>
            </>
          ) : (
            <>
              <span className="arcade-btn-pill-letter">A</span>
              <span>PRESS TO JUMP</span>
            </>
          )}
        </button>

        {/* Keyboard / Touch Instructions Pill */}
        <div className="gameboy-hint-pill">
          <span>🎮 Spacebar / Up Arrow to Jump • Double Tap in Air to Double Jump</span>
        </div>
      </div>
    </div>
  );
}
