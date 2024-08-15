## Oscar's Solution

### Sync
Given the requirements and what it implies, my solution is prioritizing cases where the number of logs across all logSources `(l)` is significantly greater than the number of logSources `(n)`.

Because of this, my solution gets the next log for each source, puts them into a list and then sorts them, since we are unsure of what the order would be between log sources. Once sorted (in reverse), we know that the last element is the earliest log. I chose to store it in reverse because `shift` should be less performant than `pop` based on a quick google search. 

Once we have the log, we print it, then use the index to determine which logSource to pull from. Once we have the index, we can pull the next log, and put the new log back into the list. Since the new log is part of the same logSource, we know the timestamp is greater than the previously printed log, but because it is not part of the sorted list, we do not know how it matches with other dates and have to sort to figure it out. I tried using the built in sort function, and realized that an implementation of binary search and then splicing the list was faster, based on testing. Although both would be `O(nlogn)`, I'm guessing the splicing is typically more performant than `O(n)`. Overall the performance would be `O(nlogn * l)` (the bottle neck being the number of logs total multiplied by the time it takes to add and subsequently sort the new log being added to the array). The memory used should also be reasonable, since we are only storing a single array of size `n`.

I attempted a more performant version where we use a linked list instead of an array, since that presumably would be `O(n)` instead of `O(nlogn)` for the adding to the list. However, I found in testing that this actually performed more poorly if I increased the load even to 1000 or 10000, possibly because `splice` is a bit more performant than I anticipated. As a result, I chose to go with my original approach (see `sync-sorted-merge-linked-list.js` for this solution).

### Async
My async solution is based on my synchronous solution (shared methods are in the shared.js file), however there are a few differences.

When we initialize the first list of logs, we pull the list of logs in parallel, to save time.

We also have a cache of the next logs after the initial list, mapped to each index. This way, we can run the sorting of the next lgos, and the popping from the log source, which now takes additional time, in parallel. This should help improve performance.

One approach I could have taken would be to have the cache map to a list of next logs for each logSource instead of just the next one. This would mean that we wouldn't necessarily need to wait for each log everytime we print, which could improve performance in cases where the popping is the bottleneck, rather than the sorting. However, I decided the complexity for this solution was too high given the scope.

### Verification
For both solutions, I was able to verify that the `drained` flag returned true on all `logSources`, and printed out the logs without erroring. That leads me to believe both solutions are working as expected.