// import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';

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
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
  colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'],
};

export default CustomPieChart;