"use client";

import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react';

const PANEL_WIDTH_COLLAPSED = 20;
const PANEL_WIDTH_EXPANDED = 400;
const PANEL_WIDTH_EXPANDED_MOBILE= 100;
const PANEL_GAP = 5;
const BREAKPOINT_MOBILE = 1000;

const MOVIES = [
  {
    "movie": "The Notebook",
    "year": 2004,
    "imdb_id": "tt0332280",
    "poster_url": "https://img.omdbapi.com/?i=tt0332280&apikey=trilogy&h=600"
  },
  {
    "movie": "La La Land",
    "year": 2016,
    "imdb_id": "tt3783958",
    "poster_url": "https://img.omdbapi.com/?i=tt3783958&apikey=trilogy&h=600"
  },
  {
    "movie": "500 Days of Summer",
    "year": 2009,
    "imdb_id": "tt1022603",
    "poster_url": "https://img.omdbapi.com/?i=tt1022603&apikey=trilogy&h=600"
  },
  {
    "movie": "How to Lose a Guy in 10 Days",
    "year": 2003,
    "imdb_id": "tt0251127",
    "poster_url": "https://img.omdbapi.com/?i=tt0251127&apikey=trilogy&h=600"
  },
  {
    "movie": "10 Things I Hate About You",
    "year": 1999,
    "imdb_id": "tt0147800",
    "poster_url": "https://img.omdbapi.com/?i=tt0147800&apikey=trilogy&h=600"
  },
  {
    "movie": "Mamma Mia!",
    "year": 2008,
    "imdb_id": "tt0795421",
    "poster_url": "https://img.omdbapi.com/?i=tt0795421&apikey=trilogy&h=600"
  },
  {
    "movie": "Legally Blonde",
    "year": 2001,
    "imdb_id": "tt0250494",
    "poster_url": "https://img.omdbapi.com/?i=tt0250494&apikey=trilogy&h=600"
  },
  {
    "movie": "Mean Girls",
    "year": 2004,
    "imdb_id": "tt0377092",
    "poster_url": "https://img.omdbapi.com/?i=tt0377092&apikey=trilogy&h=600"
  },
  {
    "movie": "27 Dresses",
    "year": 2008,
    "imdb_id": "tt0988595",
    "poster_url": "https://img.omdbapi.com/?i=tt0988595&apikey=trilogy&h=600"
  }
];

export default function Spotlight() {
    const trackRef = useRef(null);
    const [trackWidth, setTrackWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [focusedPanel, setFocusedPanel] = useState(0);
   
    const panelCount = isMobile ? 9 : 18;

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            setTrackWidth(entry.contentRect.width);
            setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
        });
        if (trackRef.current) observer.observe(trackRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        setFocusedPanel(0);
    }, [panelCount]);

    // Dynamic width calculation for perfect responsive behavior without overflow
    const currentTrackWidth = trackWidth || 1200;
    const expandedWidth = isMobile 
        ? Math.min(260, currentTrackWidth * 0.55) 
        : PANEL_WIDTH_EXPANDED;
    
    const collapsedWidth = isMobile
        ? Math.max(12, (currentTrackWidth - expandedWidth - (panelCount - 1) * PANEL_GAP) / (panelCount - 1))
        : PANEL_WIDTH_COLLAPSED;

    const getPanelPosition = useCallback(
        (panelIndex) => {
            const totalTrackWidth =
                (panelCount - 1) * (collapsedWidth + PANEL_GAP) +
                expandedWidth;
            const offsetToCenter = (trackWidth - totalTrackWidth) / 2;
            let left = offsetToCenter;
            for (let i = 0; i < panelIndex; i++) {
                const w = i === focusedPanel ? expandedWidth : collapsedWidth;
                left += w + PANEL_GAP;
            }
            const width =
                panelIndex === focusedPanel ? expandedWidth : collapsedWidth;
            return { left, width };
        },
        [focusedPanel, panelCount, expandedWidth, collapsedWidth, trackWidth]
    );

    const focusPanel = useCallback((index) => {
        setFocusedPanel(index);
    }, []);

    const getFocusIndicatorPosition = useCallback(() => {
        return getPanelPosition(focusedPanel);
    }, [focusedPanel, getPanelPosition]);

    const activeMovie = MOVIES[focusedPanel % MOVIES.length];

    return (
      <section className="spotlight">
        {/* Ambient Blurred Background of Focused Movie Poster */}
        <div 
          className="ambient-background"
          style={{ backgroundImage: `url(${activeMovie?.poster_url})` }}
        />

        {/* Watchlist Header */}
        <header className="spotlight-header">
          <span className="subtitle">Watchlist</span>
          <h1 className="title">Movies I Wanna Watch with Pratik</h1>
          <div className="header-divider"></div>
        </header>

        <div className="spotlight-track" ref={trackRef}>
          <div className="spotlight-panels">
            <div
              className="spotlight-focus-indicator"
              style={getFocusIndicatorPosition()}
            />
            {Array.from({ length: panelCount }, (_, i) => {
              const movie = MOVIES[i % MOVIES.length];
              const isFocused = i === focusedPanel;
              return (
                <div
                  key={`${isMobile ? "m" : "d"}-${i}`}
                  className={`spotlight-panel ${isFocused ? "focused" : ""}`}
                  style={getPanelPosition(i)}
                  onMouseEnter={!isMobile ? () => focusPanel(i) : undefined}
                  onClick={isMobile ? () => focusPanel(i) : undefined}
                >
                  <img src={movie.poster_url} alt={movie.movie} />
                  <div className={`spotlight-panel-title ${isFocused ? "visible" : ""}`}>
                    <h3 className="movie-title">{movie.movie}</h3>
                    <span className="movie-year">{movie.year}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
}

