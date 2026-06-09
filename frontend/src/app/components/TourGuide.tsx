"use client";

import { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

type TourGuideProps = {
  runId: number;
  onClose: () => void;
};

export default function TourGuide({ runId, onClose }: TourGuideProps) {
  useEffect(() => {
    if (runId === 0) {
      return undefined;
    }

    let tour: InstanceType<typeof Shepherd.Tour> | null = null;
    const frameId = window.requestAnimationFrame(() => {
      tour = new Shepherd.Tour({
        defaultStepOptions: {
          scrollTo: false,
          cancelIcon: { enabled: true },
          classes: "shadow-md",
        },
        useModalOverlay: true,
      });

      const hasTarget = (selector: string) => Boolean(document.querySelector(selector));
      let stepCount = 0;

      if (hasTarget(".search-container")) {
        stepCount += 1;
        tour.addStep({
          id: "search",
          text: "Search for movies and add a rating.",
          attachTo: { element: ".search-container", on: "bottom" },
          buttons: [{ text: "Next", action: () => tour?.next() }],
        });
      }

      if (hasTarget(".movie-tags-container")) {
        stepCount += 1;
        tour.addStep({
          id: "rated-movies",
          text: "Your rated movies keep the recommendation model tuned.",
          attachTo: { element: ".movie-tags-container", on: "bottom" },
          buttons: [
            { text: "Back", action: () => tour?.back() },
            { text: "Next", action: () => tour?.next() },
          ],
        });
      }

      if (hasTarget(".carousel")) {
        stepCount += 1;
        tour.addStep({
          id: "carousel",
          text: "Browse the broader library while you decide what to rate.",
          attachTo: { element: ".carousel", on: "top" },
          buttons: [
            { text: "Back", action: () => tour?.back() },
            { text: "Next", action: () => tour?.next() },
          ],
        });
      }

      if (hasTarget(".recommendations")) {
        stepCount += 1;
        tour.addStep({
          id: "recommendations",
          text: "Personalized recommendations appear here.",
          attachTo: { element: ".recommendations", on: "top" },
          buttons: [
            { text: "Back", action: () => tour?.back() },
            { text: "Finish", action: () => tour?.complete() },
          ],
        });
      }

      tour.on("complete", onClose);
      tour.on("cancel", onClose);
      if (stepCount > 0) {
        tour.start();
      } else {
        onClose();
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      tour?.cancel();
    };
  }, [runId, onClose]);

  return null;
}
