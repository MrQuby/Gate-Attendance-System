import React from 'react';

const AdminHeader = ({ title }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }).toUpperCase();

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-8 py-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="text-right">
          <div className="text-gray-600 font-semibold">{formattedDate}</div>
          <div className="text-gray-500">{formattedTime}</div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
