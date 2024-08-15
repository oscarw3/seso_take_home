"use strict";

const helpers = require("./shared");

// Print all entries, across all of the *async* sources, in chronological order.

// generates list of next logs for each log source
const generateNextLogsForSourcesAsync = async (logSources) => {
  const nextLogPromises = logSources.map((logSource, index) => logSource.popAsync().then((log) => { return { log, index}}))
  const nextLogsForSources = await Promise.all(nextLogPromises)
  return nextLogsForSources.filter((nextLog) => !!nextLog.log)
}

// generates a cache of subsequent logs for each log source, mapped to the index.
const generateLogSourcesCache = async (logSources) => {
  const list = await generateNextLogsForSourcesAsync(logSources)
  const cache = {}
  for (let logData of list) {
    cache[logData.index] = logData
  }
  return cache
}

const updateLogSourcesCache = async (cache, logSources, index) => {
  const log = await logSources[index].popAsync()
  if (!log) {
    cache[index] = undefined;
    return;
  }
  cache[index] = {log, index}
}

module.exports = async (logSources, printer) => {
  return await new Promise(async (resolve) => {
      const nextLogsForSources = await generateNextLogsForSourcesAsync(logSources, printer); // Wait for someAsyncOperation to complete
      helpers.presort(nextLogsForSources)

      const logSourcesCache = await generateLogSourcesCache(logSources);

      while (nextLogsForSources.length > 0) {
        const currLogData = nextLogsForSources.pop()
        printer.print(currLogData.log)
        const nextLogData = logSourcesCache[currLogData.index]

        let addAndSortPromise = new Promise(function(nestedResolve) {
          if (!!nextLogData) {
            helpers.addAndSort(nextLogsForSources, nextLogData)
          }
          nestedResolve(); 
        });
        await Promise.all([updateLogSourcesCache(logSourcesCache, logSources, currLogData.index), addAndSortPromise])
      }
      printer.done()
      resolve(console.log("Async sort complete.")); 
  });
};
