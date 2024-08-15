"use strict";

// Print all entries, across all of the sources, in chronological order.

// sort data assuming an unsorted list
const presort = (nextLogsList) => {
    nextLogsList.sort((a, b) => {
    return a.log.date.getTime() - b.log.date.getTime()
  })
}

// adds new elem to linked list. this way its O(n) instead of O(nlogn)
const addAndSortLinkedList = (start, newLogData) => {
  let curr = start
  let last = null
  while (!!curr) {
    if (curr.log.date.getTime() < newLogData.log.date.getTime()) {
      last = curr
      curr = curr.next;
    } else {
      newLogData.next = curr
      if (!last) {
        return newLogData
      }
      last.next = newLogData
      return start
    }
  }

  if (last) {
    last.next = newLogData
  }
  return start
}

// creates a linked list from the list of the sorted next logs
const createLinkedList = (logSources) => {
  const nextLogsList = generateNextLogsList(logSources);
  presort(nextLogsList);
  if (nextLogsList.length == 0) {
    return null
  }
  let start = nextLogsList[0]
  let curr = nextLogsList[0]
  let last = nextLogsList[0]

  for (let i = 1; i < nextLogsList.length; i++) {
    curr = nextLogsList[i]
    last.next = curr
    last = curr
  }
  return start
}

const generateNextLogsList = (logSources) => {
  const nextLogsList = []
  for (let i = 0; i < logSources.length; i++)  {
    const log = logSources[i].pop()
    if (!!log) {
      nextLogsList.push({
        log,
        index: i,
      });
    }
  }
  return nextLogsList
}

module.exports = (logSources, printer) => {
  let curr = createLinkedList(logSources);
  while (!!curr) {
    const currLogData = curr
    printer.print(currLogData.log)
    const currLogSource = logSources[currLogData.index]
    const logToAdd = currLogSource.pop()
    curr = curr.next
    if (!!logToAdd) {
      curr = addAndSortLinkedList(curr, {log: logToAdd, index: currLogData.index})
    }
  }
  printer.done()
  return console.log("Sync sort complete.");
};