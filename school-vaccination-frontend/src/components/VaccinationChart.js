import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const VaccinationChart = ({ vaccinated, unvaccinated }) => {
  const data = {
    labels: ["Vaccinated", "Unvaccinated"],
    datasets: [
      {
        data: [vaccinated, unvaccinated],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full max-w-xs mx-auto">
  <Pie data={data} />
</div>

  );
};

export default VaccinationChart;
