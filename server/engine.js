const moment = require('moment');

const service = require('./clockify');
const logger = require('./logger');

// gets all projects by client
const getProjectsByClient = async client => {
  try {
    const res = await service.getProjects();
    return res.data.filter(x => x.clientId === client);
  } catch (err) {
    logger.error(err, { client });
    return null;
  }
};

// gets entries per project and returns json response
const getTimeEntriesByProject = async (project, start, end) => {
  try {
    const res = await service.getTimeEntries(project, start, end);
    return res.data;
  } catch (err) {
    logger.error(err, { project, start, end });
    return null;
  }
};

// decodes Clockify time output
const decodeEntry = entry => {
  // entry -> PT1H42M26S
  const output = { h: 0, m: 0, s: 0 };
  let time = entry.replace('PT', ''); // PT1H42M26S -> 1H42M26S

  if (time.indexOf('H') >= 0) {
    output.h = parseInt(time.split('H')[0], 10);
    time = time.split('H')[1]; // 42M26S
  }
  if (time.indexOf('M') >= 0) {
    output.m = parseInt(time.split('M')[0], 10);
    time = time.split('M')[1]; // 26S
  }
  if (time.indexOf('S') >= 0) {
    output.s = parseInt(time.split('S')[0], 10);
  }
  return output;
};

// recalculates time so 70min would be 1h 10m
const recalculateTime = entry => {
  if (entry.s >= 60) {
    entry.m += 1;
    entry.s %= 60;
  }
  if (entry.m >= 60) {
    entry.h += 1;
    entry.m %= 60;
  }
  return entry;
};

// creates a "total" properties where it sums
// all time entries for each project
const sumTimeEntries = projects => {
  Object.keys(projects).forEach(p => {
    if (!projects[p].total) {
      // default object
      projects[p].total = {
        h: 0,
        m: 0,
        s: 0,
      };
    }

    projects[p].entries.forEach(entry => {
      const decodedEntry = decodeEntry(entry.duration);
      const currentEntry = projects[p].total;

      // sum existing with new values
      projects[p].total = {
        h: currentEntry.h + decodedEntry.h,
        m: currentEntry.m + decodedEntry.m,
        s: currentEntry.s + decodedEntry.s,
      };
      // re-calculate totals so 70min would be 1h 10m
      projects[p].total = recalculateTime(projects[p].total);
    });
  });

  return projects;
};

const parseIncomingDate = date => {
  // January '20
  let [month, year] = date.split(" '");
  if (date === '') {
    const now = moment();
    month = now.format('MMMM');
    year = now.format('YY');
  }
  return {
    month,
    year,
  };
};

// main call to get all times from a client
const getTimes = async (client, from) => {
  // from = "20200" ~ "202012"
  const now = moment();
  const parsedDate = parseIncomingDate(from);
  const mFrom = from ? moment(`'01-${parsedDate.month}-${parsedDate.year}`, 'DD-MMMM-YY') : now.startOf('month');
  const formFrom = `${mFrom.format('YYYY-MM-DDT00:00:00')}Z`;
  const formTo = `${mFrom.add(1, 'month').format('YYYY-MM-DDT00:00:00')}Z`;

  const projects = await getProjectsByClient(client);
  if (!projects) {
    return [];
  }

  const entries = {};
  for (let i = 0; i < projects.length; i += 1) {
    const p = projects[i];
    // eslint-disable-next-line no-await-in-loop
    const times = await getTimeEntriesByProject(p.id, formFrom, formTo);

    if (times && times.length > 0) {
      if (!entries[p.name]) {
        entries[p.name] = {
          note: p.note,
          entries: [],
        };
      }

      entries[p.name].entries = times.map(x => {
        return {
          description: x.description,
          duration: x.timeInterval.duration,
        };
      });
    }
  }

  return sumTimeEntries(entries);
};

exports.getTimes = getTimes;
