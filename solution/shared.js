// add element into a sorted list, and make sure it's still sorted
const addAndSort = (sortedLogsList, newLogData) => {
    // do a version of binary search where it inserts where it should be based on the search. this should keep it O(log n), where n is the number of log sources
    let left = 0
    let right = sortedLogsList.length - 1;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (sortedLogsList[mid].log.date.getTime() === newLogData.log.date.getTime()) {
        sortedLogsList.splice(mid, 0, newLogData)
        return
      } else if (sortedLogsList[mid].log.date.getTime() > newLogData.log.date.getTime()) {
        left = mid + 1
      } else {
        right = mid - 1;  
      }
    }
    return sortedLogsList.splice(right+1, 0, newLogData)
}

const presort = (nextLogsList) => {
    nextLogsList.sort((a, b) => {
    return b.log.date.getTime() - a.log.date.getTime()
  })
}

module.exports = {
    presort,
    addAndSort
}

