import React, { useState, useEffect } from 'react';
import { requestAPI } from '../services/api';
import '../styles/Calendar.css';

function RequestCalendar() {
  const [requests, setRequests] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await requestAPI.getAll();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    // 0 = Sunday, 1 = Monday, ...
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getRequestsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return requests.filter((r) => {
      if (!r.scheduledDate) return false;
      const reqDateStr = new Date(r.scheduledDate).toISOString().split('T')[0];
      return reqDateStr === dateStr;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDay(null);
  };

  const selectedRequests =
    selectedDay != null ? getRequestsForDate(selectedDay) : [];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>{'<'} Prev</button>
        <h2>
          {monthName} {year}
        </h2>
        <button onClick={handleNextMonth}>Next {'>'}</button>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="calendar-day-header">
            {d}
          </div>
        ))}

        {days.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="calendar-day empty" />;
          }

          const dayRequests = getRequestsForDate(day);

          return (
            <div
              key={idx}
              className={`calendar-day ${
                selectedDay === day ? 'selected' : ''
              }`}
              onClick={() => setSelectedDay(day)}
            >
              <div className="day-number">{day}</div>
              {dayRequests.length > 0 && (
                <div className="request-dot">
                  • {dayRequests.length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-details">
        {selectedDay == null ? (
          <p>Select a day to view scheduled requests.</p>
        ) : selectedRequests.length === 0 ? (
          <p>No requests scheduled on this day.</p>
        ) : (
          <div>
            <h3>
              Requests on {selectedDay} {monthName} {year}
            </h3>
            <ul>
              {selectedRequests.map((r) => (
                <li key={r._id}>
                  <strong>{r.name}</strong> ({r.type}) –{' '}
                  {r.equipment?.name || 'No equipment'} – state: {r.state}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestCalendar;
