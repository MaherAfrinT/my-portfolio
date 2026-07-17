import React, { useMemo } from 'react';
import {
  format,
  subDays,
  eachDayOfInterval,
  startOfDay,
  getDay,
} from 'date-fns';

export function CalendarHeatmap({ entries = [] }) {
  // intensity colors from 0 to 4
  const colorScale = [
    'bg-slate-100 dark:bg-slate-800', // 0
    'bg-cyan-200 dark:bg-cyan-900', // 1
    'bg-cyan-400 dark:bg-cyan-700', // 2
    'bg-cyan-500 dark:bg-cyan-500', // 3
    'bg-cyan-600 dark:bg-cyan-400', // 4
  ];

  const { days, monthLabels } = useMemo(() => {
    const today = startOfDay(new Date());
    const startDate = subDays(today, 364); // Last 365 days

    // Create map of entries by date string
    const entryCounts = new Map();
    entries.forEach((entry) => {
      // Handle both Firestore Timestamp and string
      const d = entry.date?.toDate ? entry.date.toDate() : new Date(entry.date);
      const dateStr = format(d, 'yyyy-MM-dd');
      entryCounts.set(dateStr, (entryCounts.get(dateStr) || 0) + 1);
    });

    const dateInterval = eachDayOfInterval({ start: startDate, end: today });

    const daysArr = [];
    const months = [];
    let currentMonth = -1;

    dateInterval.forEach((date, i) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = entryCounts.get(dateStr) || 0;
      const intensity = Math.min(count, 4);

      const month = date.getMonth();

      // Track month labels (only add label if it's a new month and we are at the start of a week)
      if (month !== currentMonth && date.getDay() === 0) {
        months.push({ label: format(date, 'MMM'), index: Math.floor(i / 7) });
        currentMonth = month;
      }

      daysArr.push({
        date,
        dateStr,
        intensity,
        count,
      });
    });

    // Pad the beginning so the first day aligns with its correct day of week
    const firstDayOfWeek = getDay(startDate);
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArr.unshift(null); // empty cells
    }

    return { days: daysArr, monthLabels: months };
  }, [entries]);

  // Group into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex min-w-max flex-col gap-2">
        {/* Months header */}
        <div className="relative flex h-4 pl-8 text-xs text-slate-500 dark:text-slate-400">
          {monthLabels.map((m, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${m.index * 16 + 32}px` }}
            >
              {m.label}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Days of week labels */}
          <div className="flex w-6 flex-col justify-between gap-1 py-1 text-[10px] text-slate-500 dark:text-slate-400">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-1">
                {week.map((day, dIndex) => {
                  if (!day)
                    return (
                      <div
                        key={`empty-${wIndex}-${dIndex}`}
                        className="h-3 w-3 rounded-sm opacity-0"
                      />
                    );

                  return (
                    <div
                      key={day.dateStr}
                      title={`${format(day.date, 'MMM d, yyyy')}${day.count > 0 ? `\n${day.count} entry${day.count !== 1 ? 's' : ''}` : '\nNo entries'}`}
                      className={`h-3 w-3 rounded-sm transition-colors duration-200 ${colorScale[day.intensity]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center justify-end gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="flex gap-1">
            {colorScale.map((color, i) => (
              <div key={i} className={`h-3 w-3 rounded-sm ${color}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
