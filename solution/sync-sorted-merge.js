"use strict";

const helpers = require("./shared");

// Print all entries, across all of the sources, in chronological order.
const generateNextLogsForSources = (logSources) => {
  const nextLogsForSources = []
  for (let i = 0; i < logSources.length; i++)  {
    const log = logSources[i].pop()
    if (!!log) {
      nextLogsForSources.push({
        log,
        index: i,
      });
    }
  }
  return nextLogsForSources
}

module.exports = (logSources, printer) => {
  const nextLogsForSources = generateNextLogsForSources(logSources);

  helpers.presort(nextLogsForSources);
  while (nextLogsForSources.length > 0) {
    const currLogData = nextLogsForSources.pop()
    printer.print(currLogData.log)
    const currLogSource = logSources[currLogData.index]
    const logToAdd = currLogSource.pop()
    if (!!logToAdd) {
      helpers.addAndSort(nextLogsForSources, {log: logToAdd, index: currLogData.index})
    }
  }
  printer.done()
  return console.log("Sync sort complete.");
};
