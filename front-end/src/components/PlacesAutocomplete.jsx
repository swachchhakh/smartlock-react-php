// src/components/AutocompleteCustom.jsx
import React, { useState, useCallback } from "react";
import useAutocompleteSuggestions from "../hooks/useAutocompleteSuggestions";

const AutocompleteCustom = ({ onPlaceSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const { suggestions, resetSession, isLoading } = useAutocompleteSuggestions(inputValue);

  const handleInput = useCallback((e) => setInputValue(e.target.value), []);

  const handleSuggestionClick = useCallback(
    async (suggestion) => {
      if (!suggestion.placePrediction) return;

      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ["viewport", "location", "formattedAddress"]
      });

      setInputValue("");
      resetSession();

      onPlaceSelect({
        label: place.formattedAddress || place.name,
        lat: place.location.lat(),
        lng: place.location.lng(),
        viewport: place.viewport
      });
    },
    [onPlaceSelect]
  );

  return (
    <div style={{ position: "relative" }}>
      <input
        value={inputValue}
        onChange={handleInput}
        placeholder="Search for a place"
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      {isLoading && <div style={{ position: "absolute", right: 8, top: 8 }}>Loading...</div>}
      {suggestions.length > 0 && (
        <ul style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "white",
          border: "1px solid #ccc",
          maxHeight: "200px",
          overflowY: "auto",
          zIndex: 1000,
          marginTop: "2px",
          listStyle: "none",
          padding: 0
        }}>
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(s)}
              style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" }}
            >
              {s.placePrediction?.text.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteCustom;
