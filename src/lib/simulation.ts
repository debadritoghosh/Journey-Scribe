import { Trip, ItineraryItem, Activity } from "../types";

/**
 * Runs a Monte Carlo simulation to predict the success of a trip itinerary.
 * Factors in risk levels for each activity (weather, traffic, friction).
 * Returns a stress score (0-100) and an efficiency report.
 */
export function runTripSimulation(trip: Trip, iterations: number = 1000): { stressScore: number; efficiencyReport: string } {
  if (!trip.itinerary || trip.itinerary.length === 0) {
    return { stressScore: 0, efficiencyReport: "No itinerary to simulate." };
  }

  let failures = 0;
  const totalActivities = trip.itinerary.reduce((acc, item) => acc + item.activities.length, 0);

  for (let i = 0; i < iterations; i++) {
    let tripFailed = false;
    let cumulativeDelay = 0; // in minutes

    for (const day of trip.itinerary) {
      for (const activity of day.activities) {
        // Base risk from the activity (provided by AI)
        const risk = activity.riskLevel || 0.1;
        
        // Simulate a delay event
        if (Math.random() < risk) {
          // Delay duration: 15 to 120 minutes
          const delay = Math.floor(Math.random() * 105) + 15;
          cumulativeDelay += delay;
        }

        // If cumulative delay exceeds 180 minutes (3 hours) in a single day, 
        // we consider the day's schedule "stressed" or "failed"
        if (cumulativeDelay > 180) {
          tripFailed = true;
          break;
        }
      }
      if (tripFailed) break;
      // Reset delay for next day (assuming sleep/rest resets the schedule)
      cumulativeDelay = 0;
    }

    if (tripFailed) {
      failures++;
    }
  }

  const stressScore = Math.round((failures / iterations) * 100);
  
  let efficiencyReport = "";
  if (stressScore < 20) {
    efficiencyReport = "The Efficiency Architect confirms: This itinerary is highly optimized with minimal dead time and robust transit logic.";
  } else if (stressScore < 50) {
    efficiencyReport = "Moderate risk detected. Some transit gaps are tight, especially in peak hours. Consider adding buffer time between major attractions.";
  } else {
    efficiencyReport = "High stress detected. This schedule has a high chance of failing due to tight transit gaps and typical tourist friction. The Efficiency Architect recommends removing at least one activity per day.";
  }

  return { stressScore, efficiencyReport };
}
