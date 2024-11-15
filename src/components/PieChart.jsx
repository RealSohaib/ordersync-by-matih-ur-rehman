// import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const defaultColors= [
  "#FF6384", // Soft Red
  "#36A2EB", // Light Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Aqua
  "#9966FF", // Lavender
  "#FF9F40", // Orange
  "#8C564B", // Brown
  "#E377C2", // Pink
  "#7F7F7F", // Gray
  "#BCBD22", // Olive
  "#17BECF", // Cyan
  "#AEC7E8", // Light Blue (alternative)
  "#FFBB78", // Light Orange
  "#98DF8A", // Light Green
  "#C49C94", // Tan
  "#C5B0D5", // Light Purple
  "#F7B6D2", // Light Pink
  "#D62728", // Red
  "#2CA02C", // Green
  "#1F77B4"  // Blue
]
const CustomPieChart = ({ names, counts, colors }) => {
  const data = names.map((name, index) => ({
    name,
    value: counts[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill=""
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

CustomPieChart.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  counts: PropTypes.arrayOf(PropTypes.number).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
};

CustomPieChart.defaultProps = {
  colors:  defaultColors
};

export default CustomPieChart;