import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiTerminal,
  FiSearch,
  FiSun,
  FiMoon,
  FiGrid,
  FiAward,
  FiUsers,
  FiFolder,
  FiUser,
  FiSettings,
  FiPlay,
  FiX,
  FiMessageSquare,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

const CommandCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);

  const isChallengePage = location.pathname.startsWith("/challenge/");

  // Dynamic context-aware commands list
  const commands = [
    {
      id: "run-code",
      title: "Run Code",
      subtitle: isChallengePage ? "Execute current solution" : "Only available in challenge workspace",
      icon: FiPlay,
      shortcut: "Ctrl + Enter",
      category: "Challenge Action",
      disabled: !isChallengePage,
      action: () => {
        if (isChallengePage) {
          window.dispatchEvent(new CustomEvent("run-code-shortcut"));
          setIsOpen(false);
        }
      },
    },
    {
      id: "toggle-theme",
      title: "Toggle Theme",
      subtitle: "Switch between light and dark modes",
      icon: FiSun,
      shortcut: "Alt + T",
      category: "Appearance",
      action: () => {
        const btn = document.querySelector('[aria-label="Toggle Theme"]');
        if (btn) {
          btn.click();
        } else {
          // Fallback if button not found
          const isDark = document.documentElement.classList.contains("dark");
          window.dispatchEvent(new CustomEvent("theme-change", { detail: isDark ? "light" : "dark" }));
        }
        setIsOpen(false);
      },
    },
    {
      id: "nav-dashboard",
      title: "Go to Dashboard",
      subtitle: "Browse challenges and status sets",
      icon: FiGrid,
      shortcut: "G + D",
      category: "Navigation",
      action: () => {
        navigate("/dashboard");
        setIsOpen(false);
      },
    },
    {
      id: "nav-leaderboard",
      title: "Go to Leaderboard",
      subtitle: "Check clan and member standings",
      icon: FiAward,
      shortcut: "G + L",
      category: "Navigation",
      action: () => {
        navigate("/leaderboard");
        setIsOpen(false);
      },
    },
    {
      id: "nav-clans",
      title: "Go to Clans Hub",
      subtitle: "View clan details and rosters",
      icon: FiUsers,
      shortcut: "G + C",
      category: "Navigation",
      action: () => {
        navigate("/clans");
        setIsOpen(false);
      },
    },
    {
      id: "nav-archives",
      title: "Go to Archives",
      subtitle: "Explore resource sets and documents",
      icon: FiFolder,
      shortcut: "G + A",
      category: "Navigation",
      action: () => {
        navigate("/resources");
        setIsOpen(false);
      },
    },
    {
      id: "nav-profile",
      title: "Go to Profile",
      subtitle: "View your score, clan info, and stats",
      icon: FiUser,
      shortcut: "G + P",
      category: "Navigation",
      action: () => {
        navigate("/profile");
        setIsOpen(false);
      },
    },
    {
      id: "nav-settings",
      title: "Go to Settings",
      subtitle: "Customize your avatar and bio",
      icon: FiSettings,
      shortcut: "G + S",
      category: "Navigation",
      action: () => {
        navigate("/settings");
        setIsOpen(false);
      },
    },
    {
      id: "social-whatsapp",
      title: "Join WhatsApp Channel",
      subtitle: "Get GDGoC announcements and alerts",
      icon: FiMessageSquare,
      category: "GDGoC SOA ITER Platforms",
      action: () => {
        window.open("https://whatsapp.com/channel/0029VbBdIckHVvTRsbC5SJ16", "_blank", "noopener,noreferrer");
        setIsOpen(false);
      },
    },
    {
      id: "social-instagram",
      title: "Follow Instagram",
      subtitle: "Stay updated with event postings",
      icon: FiInstagram,
      category: "GDGoC SOA ITER Platforms",
      action: () => {
        window.open("https://www.instagram.com/gdg_iter?igsh=MXFhc3UwdW40NmQ2cg==", "_blank", "noopener,noreferrer");
        setIsOpen(false);
      },
    },
    {
      id: "social-linkedin",
      title: "Connect on LinkedIn",
      subtitle: "Build professional GDG networks",
      icon: FiLinkedin,
      category: "GDGoC SOA ITER Platforms",
      action: () => {
        window.open("https://www.linkedin.com/company/google-developer-student-club-iter/", "_blank", "noopener,noreferrer");
        setIsOpen(false);
      },
    },
  ];

  // Global keybind listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Command Palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Toggle Theme: Alt+T or Option+T
      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        const themeBtn = document.querySelector('[aria-label="Toggle Theme"]');
        if (themeBtn) {
          themeBtn.click();
        }
        return;
      }

      // Skip navigation shortkeys if in input/textarea
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable);

      if (isInputFocused) return;

      // Sequential navigation G + X shortcuts
      if (e.key === "?") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter commands based on search query
  const filteredCommands = commands.filter((cmd) => {
    const query = searchQuery.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(query) ||
      cmd.subtitle.toLowerCase().includes(query) ||
      cmd.category.toLowerCase().includes(query)
    );
  });

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard navigation inside the palette
  const handleModalKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    if (filteredCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected && !selected.disabled) {
          selected.action();
        }
      }
    } else {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    }

    // Tab trap inside Command Center
    if (e.key === "Tab") {
      e.preventDefault(); // Lock focus inside input or close button
      if (document.activeElement === inputRef.current) {
        const closeBtn = modalRef.current?.querySelector(".close-btn");
        closeBtn?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  };

  // Helper to render matched query string with Google colors
  const highlightMatch = (text) => {
    if (!searchQuery) return <span>{text}</span>;
    const regex = new RegExp(`(${searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark
              key={i}
              className="bg-transparent font-extrabold"
              style={{
                color: "rgb(var(--accent-rgb))",
                textShadow: "0 0 4px rgba(var(--accent-rgb), 0.2)",
              }}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <>
      {/* Floating launcher with subtle pulsing GDG signature quad-color ring */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full bg-glass-surface shadow-lg backdrop-blur-md
                   text-secondary hover:text-accent transition-all duration-300
                   flex items-center justify-center group"
        aria-label="Open Command Center"
        title="Open CommandCenter (Ctrl + K)"
      >
        {/* Glowing quad-color animated background ring representing official GDG color aesthetics */}
        <span className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-tr from-[#4285F4] via-[#EA4335] to-[#34A853] animate-[spin_4s_linear_infinite] opacity-40 group-hover:opacity-100 transition-opacity" />
        <span className="absolute inset-[1px] bg-glass-surface rounded-full z-0" />

        <FiTerminal className="text-xl z-10 group-hover:scale-110 transition-transform" />
      </button>

      {/* CommandCenter Overlay Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            ref={modalRef}
            onKeyDown={handleModalKeyDown}
            className="w-full max-w-lg surface-overlay macos-glass rounded-xl overflow-hidden relative shadow-2xl flex flex-col max-h-[70vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Google Developer Groups On Campus Command Center"
          >
            {/* Fine border with signature Google colors gradient */}
            <div className="h-[2px] w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

            {/* Input Prompt Section */}
            <div className="p-4 border-b border-subtle flex items-center gap-3">
              <FiSearch className="text-secondary shrink-0" size={18} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or navigate with keys..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="bg-transparent text-sm text-primary placeholder-secondary/50 focus:outline-none w-full font-body"
                spellCheck={false}
                aria-autocomplete="list"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="close-btn p-1 rounded-md text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:ring-1 focus-visible:ring-accent"
                aria-label="Close Command Center"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* CommandCenter Body */}
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {filteredCommands.length > 0 ? (
                <div className="space-y-1">
                  {/* Group items by category */}
                  {Object.entries(
                    filteredCommands.reduce((acc, cmd) => {
                      if (!acc[cmd.category]) acc[cmd.category] = [];
                      acc[cmd.category].push(cmd);
                      return acc;
                    }, {})
                  ).map(([category, items]) => (
                    <div key={category} className="space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-secondary uppercase tracking-[0.15em] select-none">
                        {category}
                      </div>
                      {items.map((cmd) => {
                        const globalIndex = filteredCommands.findIndex((c) => c.id === cmd.id);
                        const isHighlighted = globalIndex === selectedIndex;
                        const Icon = cmd.icon;

                        return (
                          <div
                            key={cmd.id}
                            onClick={() => {
                              if (!cmd.disabled) cmd.action();
                            }}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                              isHighlighted
                                ? "bg-accent/10 border-l-2 border-accent pl-2.5"
                                : cmd.disabled
                                ? "opacity-40 cursor-not-allowed hover:bg-transparent"
                                : "hover:bg-black/5 dark:hover:bg-white/5 pl-3"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Icon
                                className={`shrink-0 ${
                                  isHighlighted
                                    ? "text-accent"
                                    : "text-secondary"
                                }`}
                                size={16}
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-primary truncate leading-tight">
                                  {highlightMatch(cmd.title)}
                                </p>
                                <p className="text-[10px] text-secondary truncate mt-0.5 leading-none">
                                  {highlightMatch(cmd.subtitle)}
                                </p>
                              </div>
                            </div>

                            {/* Shortcut badge */}
                            {cmd.shortcut && (
                              <kbd className="text-[9px] font-mono font-medium text-secondary bg-black/5 dark:bg-white/5 border border-subtle rounded px-1.5 py-0.5 shadow-sm">
                                {cmd.shortcut}
                              </kbd>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <FiTerminal size={24} className="text-secondary/40 mb-2 animate-pulse" />
                  <p className="text-xs font-semibold text-primary">No commands found</p>
                  <p className="text-[10px] text-secondary mt-1">Try searching for other terms like 'theme' or 'clan'</p>
                </div>
              )}
            </div>

            {/* Footer with Branding & Usage help */}
            <div className="p-3 border-t border-subtle bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between text-[10px] text-secondary font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
              <div className="flex items-center gap-1">
                <span>GDGoC ITER</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommandCenter;
