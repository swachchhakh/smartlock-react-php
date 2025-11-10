// src/hooks/useAutocompleteSuggestions.js
import { useEffect, useState, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function useAutocompleteSuggestions(inputValue) {
  const places = useMapsLibrary("places");
  const serviceRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [sessionToken, setSessionToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetSession = () => {
    if (places) setSessionToken(new places.AutocompleteSessionToken());
  };

  useEffect(() => {
    if (!places || !inputValue) {
      setSuggestions([]);
      return;
    }

    if (!serviceRef.current) {
      serviceRef.current = new places.AutocompleteService();
    }

    setIsLoading(true);

    serviceRef.current.getPlacePredictions(
      {
        input: inputValue,
        sessionToken: sessionToken || new places.AutocompleteSessionToken(),
      },
      (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setSuggestions([]);
          setIsLoading(false);
          return;
        }
        setSuggestions(predictions.map((p) => ({ placePrediction: p })));
        setIsLoading(false);
      }
    );
  }, [inputValue, places, sessionToken]);

  return { suggestions, resetSession, isLoading };
}
