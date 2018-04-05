import { Observable, ReplaySubject, Subject } from 'rxjs';
import { LogLevel } from '../diagnostics/log-level';
import { Logging } from '../diagnostics/logging';
/**
 * Query Cache class.
 * - Create a cache entry by "create" call with creator object.
 * - Subscribe with options to get query result.
 * - Refresh data on-demand and interval.
 * - Dispose the resource when it's done.
 * - Recover and re-subscribe with the same handlers if necessary after an error.
 *
 * TData the data type of observable responds.
 * TParams the options parameters to pass the creator to create new observable.
 */
var QueryCache = /** @class */ (function () {
    /**
     * Initializes a new instance of the QueryCache.
     *
     * @param create the function to create a new observable with specified parameters.
     * @param serializeParams the function to generate serialized string from specified parameters. (optional)
     * @param destroy the function to clean up any residue after all reference was gone. (optional)
     */
    function QueryCache(create, serializeParams, destroy) {
        this.create = create;
        this.serializeParams = serializeParams;
        this.destroy = destroy;
    }
    /**
     * Create or return the cached observable.
     *
     * @param autoFetchOptions the options parameter auto-fetch when subscribe is called.
     * @return Observable<TData> the observable object.
     */
    QueryCache.prototype.createObservable = function (autoFetchOptions) {
        var _this = this;
        // for recovery scenario, this.cachedData.subscribers is retained.
        // clear them here if no publish ever made.
        if (this.cachedData && this.cachedData.publish) {
            if (autoFetchOptions) {
                // schedule the fetch immediately after current call stack.
                setTimeout(function () {
                    // cancel auto fetch if already unsubscribed.
                    if (_this.cachedData && _this.cachedData.publish) {
                        _this.fetch(autoFetchOptions);
                    }
                });
            }
            return this.cachedData.publish;
        }
        var fetch = new Subject();
        var refresh = new Subject();
        var apply = new Subject();
        var subscribers = [];
        var publish = this.createPublishObservable(fetch, refresh, apply, subscribers);
        this.cachedData = { fetch: fetch, refresh: refresh, publish: publish, apply: apply, subscribers: subscribers };
        this.autoFetchOptions = autoFetchOptions;
        return publish;
    };
    /**
     * Unsubscribe any remained subscribers and dispose all remained resources.
     * - clearCache() is not necessary to be called if all subscriptions are unsubscribe'ed properly.
     */
    QueryCache.prototype.clearCache = function () {
        if (!this.cachedData) {
            return;
        }
        if (this.cachedData.subscribers) {
            var tempSubscribers = this.cachedData.subscribers.slice(0);
            for (var _i = 0, tempSubscribers_1 = tempSubscribers; _i < tempSubscribers_1.length; _i++) {
                var context = tempSubscribers_1[_i];
                context.subscription.unsubscribe();
            }
        }
        this.cleanup(false);
    };
    /**
     * Fetch with new query options.
     * - The fetch starts new query when cache is empty, current cache doesn't match the key generated by
     *   serializedParams function which was configured at the constructor, interval was changed (ex.
     *   changing zero interval to active interval or other way around), or the first subscriber like when
     *   delayClean comes back active subscription.
     *
     * @param options the options with interval, delay clean, recovery and parameters.
     */
    QueryCache.prototype.fetch = function (options) {
        if (!this.cachedData) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.QueryCacheFetchOrder.message;
            Logging.log({ level: LogLevel.Error, source: 'QueryCache', message: message });
            throw new Error(message);
        }
        if (this.cachedData.fetch) {
            // send new request when cache doesn't match the key, interval was changed, or single subscriber.
            var key = this.serializeParams ? this.serializeParams(options.params) : '';
            if (!this.options
                || this.key !== key
                || this.options.interval !== options.interval
                || this.cachedData.subscribers.length === 1) {
                this.key = key;
                this.cachedData.fetch.next(options);
            }
        }
        else {
            Logging.log({
                level: LogLevel.Warning,
                source: 'QueryCache',
                message: MsftSme.resourcesStrings().MsftSmeShell.Core.Error.QueryCacheFetchErrorOnce.message
            });
        }
    };
    /**
     * Refresh the query cache with last options and parameters provided on the fetch call.
     */
    QueryCache.prototype.refresh = function () {
        if (!this.cachedData) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.QueryCacheRefreshOrder.message;
            Logging.log({ level: LogLevel.Error, source: 'QueryCache', message: message });
            throw new Error(message);
        }
        if (this.cachedData.refresh) {
            this.cachedData.refresh.next();
        }
        else {
            Logging.log({
                level: LogLevel.Warning,
                source: 'QueryCache',
                message: MsftSme.resourcesStrings().MsftSmeShell.Core.Error.QueryCacheRefreshErrorOnce.message
            });
        }
    };
    /**
     * Recover the observable and subscription.
     * - Recover can be used to resubscribe when the observable got any error situation. The observable would
     *   be unsubscribed state when it got an error response, this function allows to resubscribe without
     *   recreate observable and subscription.
     *
     * @param autoFetch if true auto fetch after re-subscribed.
     */
    QueryCache.prototype.recover = function (autoFetch) {
        if (!this.cachedData) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.QueryCacheRecoverNoCachedResource.message;
            Logging.log({ level: LogLevel.Error, source: 'QueryCache', message: message });
            throw new Error(message);
        }
        if (!this.options || !this.options.enableRecovery) {
            var message = MsftSme.resourcesStrings().MsftSmeShell.Core.Error.QueryCacheRecoverMissingRecoveryOption.message;
            Logging.log({ level: LogLevel.Error, source: 'QueryCache', message: message });
            throw new Error(message);
        }
        var tempCachedData = this.cachedData;
        if (tempCachedData.refresh) {
            tempCachedData.refresh.complete();
        }
        if (tempCachedData.fetch) {
            tempCachedData.fetch.complete();
        }
        if (tempCachedData.apply) {
            tempCachedData.apply.complete();
        }
        for (var _i = 0, _a = this.cachedData.subscribers; _i < _a.length; _i++) {
            var context = _a[_i];
            // call original unsubscribe function.
            context.subscription.unsubscribe();
        }
        // recreate new publish observable and subscribe to original set of handlers.
        var tempSubscribers = this.cachedData.subscribers.slice(0);
        var fetch = new Subject();
        var refresh = new Subject();
        var apply = new Subject();
        var subscribers = [];
        var publish = this.createPublishObservable(fetch, refresh, apply, subscribers);
        this.cachedData = { fetch: fetch, refresh: refresh, publish: publish, apply: apply, subscribers: subscribers };
        for (var _b = 0, tempSubscribers_2 = tempSubscribers; _b < tempSubscribers_2.length; _b++) {
            var context = tempSubscribers_2[_b];
            this.cachedData.publish.subscribe(context.next, context.error, context.complete, context.subscription);
        }
        if (autoFetch) {
            fetch.next(this.options);
        }
        else {
            this.options = null;
        }
    };
    /**
     * Apply instant data to the query cache. The data will be delivered to the subscriber immediately.
     *
     * @param data the data to apply to the replay.
     */
    QueryCache.prototype.apply = function (data) {
        if (this.cachedData.apply) {
            this.cachedData.apply.next(data);
        }
    };
    QueryCache.prototype.createPublishObservable = function (fetch, refresh, apply, subscribers) {
        var _this = this;
        var publish = 
        // start data query when new fetch is requested.
        fetch
            .switchMap(function (options) {
            // remember last options.
            _this.options = options;
            // merge output from expand-delay object and refresh object.
            return Observable.merge(
            // submit initial query.
            _this.create(options.params)
                .expand(function (result, index) {
                if (!options.interval || options.interval <= 0) {
                    // stop the interval delay.
                    return Observable.empty();
                }
                // return new observable after the delay.
                return Observable.of(result)
                    .delay(options.interval)
                    .switchMap(function () { return _this.create(options.params); });
            }), 
            // refresh to trigger new observable.
            refresh.switchMap(function () { return _this.create(options.params); }), 
            // apply data.
            apply);
        })
            .multicast(new ReplaySubject(1))
            .refCount();
        // override subscribe call to keep track subscription.
        publish.subscribe = (function (next, error, complete, recoverSubscription) {
            if (_this.delayTimer) {
                clearTimeout(_this.delayTimer);
                _this.delayTimer = null;
                if (_this.options && _this.options.interval) {
                    _this.options.interval = null;
                }
            }
            // override default handler with No-OP call if not set.
            // this allows all subscribe call to be get called when an error reported.            
            next = next || MsftSme.noop;
            error = error || MsftSme.noop;
            var context = { next: next, error: error, complete: complete, errorCount: 0, unsubscribeCount: 0 };
            var hookError = function (errorData) {
                context.errorCount++;
                error(errorData);
            };
            context.subscription = Object.getPrototypeOf(publish).subscribe.call(publish, next, hookError, complete);
            // hook up old subscription so old subscriber can unsubscribe properly.
            if (recoverSubscription) {
                recoverSubscription.unsubscribe = function () { return context.subscription.unsubscribe(); };
            }
            // add internal unsubscribe to the original subscription.
            context.subscription.add(_this.internalUnsubscribe.bind(_this, context));
            subscribers.push(context);
            // if createObservable() is called with autoFetchOptions, it start fetching data immediately when subscribe() is called.
            if (_this.autoFetchOptions) {
                _this.fetch(_this.autoFetchOptions);
                _this.autoFetchOptions = null;
            }
            return context.subscription;
        });
        return publish;
    };
    QueryCache.prototype.internalUnsubscribe = function (context) {
        var _this = this;
        context.unsubscribeCount++;
        if (context.unsubscribeCount > 1) {
            // ignore if it's called twice and more.
            return;
        }
        if (!this.cachedData) {
            return;
        }
        var options = this.options || {};
        if (options.enableRecovery) {
            // indicating normal unsubscribe call, so delete it.
            if (context.errorCount === 0) {
                var contextIndex = this.cachedData.subscribers.indexOf(context);
                if (contextIndex >= 0) {
                    this.cachedData.subscribers.splice(contextIndex, 1);
                }
            }
            // on the recovery mode, retains all subscriber context, and don't clean up.
            // if there no active subscription, make cleanup call. 
            var findAny = this.cachedData.subscribers.find(function (item) { return !item.subscription.closed; });
            if (!findAny) {
                if (options.delayClean) {
                    this.delayTimer = setTimeout(function () {
                        _this.cleanup(true);
                        _this.delayTimer = null;
                    }, QueryCache.delayTime);
                }
                else {
                    this.cleanup(true);
                }
            }
            return;
        }
        // non recovery mode.
        var index = this.cachedData.subscribers.indexOf(context);
        if (index >= 0) {
            this.cachedData.subscribers.splice(index, 1);
        }
        if (this.cachedData.subscribers.length === 0) {
            if (options.delayClean) {
                this.delayTimer = setTimeout(function () {
                    _this.cleanup(false);
                    _this.delayTimer = null;
                }, QueryCache.delayTime);
            }
            else {
                this.cleanup(false);
            }
        }
    };
    QueryCache.prototype.cleanup = function (recovery) {
        if (!this.cachedData) {
            return;
        }
        if (this.cachedData.fetch) {
            this.cachedData.fetch.complete();
            this.cachedData.fetch = null;
        }
        if (this.cachedData.refresh) {
            this.cachedData.refresh.complete();
            this.cachedData.refresh = null;
        }
        if (this.cachedData.apply) {
            this.cachedData.apply.complete();
            this.cachedData.apply = null;
        }
        this.cachedData.publish = null;
        this.key = null;
        // on recovery cleanup, retain subscribers and options.
        if (!recovery) {
            this.cachedData.subscribers = null;
            this.cachedData = null;
            this.options = null;
        }
        if (this.destroy) {
            this.destroy();
        }
    };
    /**
     * Delay clean up time (10 seconds)
     */
    QueryCache.delayTime = 10 * 1000;
    return QueryCache;
}());
export { QueryCache };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZGF0YS9xdWVyeS1jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRXhFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVwRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUE4RWpEOzs7Ozs7Ozs7O0dBVUc7QUFDSDtJQStCSTs7Ozs7O09BTUc7SUFDSCxvQkFDWSxNQUF5QyxFQUN6QyxlQUFvRCxFQUNwRCxPQUEyQjtRQUYzQixXQUFNLEdBQU4sTUFBTSxDQUFtQztRQUN6QyxvQkFBZSxHQUFmLGVBQWUsQ0FBcUM7UUFDcEQsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7SUFDdkMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0kscUNBQWdCLEdBQXZCLFVBQXdCLGdCQUE2QztRQUFyRSxpQkF5QkM7UUF4Qkcsa0VBQWtFO1FBQ2xFLDJDQUEyQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3QyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLDJEQUEyRDtnQkFDM0QsVUFBVSxDQUFDO29CQUNQLDZDQUE2QztvQkFDN0MsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFVBQVUsSUFBSSxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQzdDLEtBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDakMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDbkMsQ0FBQztRQUVELElBQU0sS0FBSyxHQUFHLElBQUksT0FBTyxFQUE4QixDQUFDO1FBQ3hELElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7UUFDdEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxPQUFPLEVBQVMsQ0FBQztRQUNuQyxJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBTSxPQUFPLEdBQXNCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNwRyxJQUFJLENBQUMsVUFBVSxHQUFvQyxFQUFFLEtBQUssT0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLEtBQUssT0FBQSxFQUFFLFdBQVcsYUFBQSxFQUFFLENBQUM7UUFDbkcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLCtCQUFVLEdBQWpCO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxHQUFHLENBQUMsQ0FBZ0IsVUFBZSxFQUFmLG1DQUFlLEVBQWYsNkJBQWUsRUFBZixJQUFlO2dCQUE5QixJQUFJLE9BQU8sd0JBQUE7Z0JBQ1osT0FBTyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUN0QztRQUNMLENBQUM7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLDBCQUFLLEdBQVosVUFBYSxPQUFtQztRQUM1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztZQUN2RyxPQUFPLENBQUMsR0FBRyxDQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUMxRixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEIsaUdBQWlHO1lBQ2pHLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDM0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTzttQkFDVixJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUc7bUJBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxRQUFRO21CQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFZO2dCQUNuQixLQUFLLEVBQUUsUUFBUSxDQUFDLE9BQU87Z0JBQ3ZCLE1BQU0sRUFBRSxZQUFZO2dCQUNwQixPQUFPLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsT0FBTzthQUN4RyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ksNEJBQU8sR0FBZDtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDO1lBQ3pHLE9BQU8sQ0FBQyxHQUFHLENBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzFGLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFZO2dCQUNuQixLQUFLLEVBQUUsUUFBUSxDQUFDLE9BQU87Z0JBQ3ZCLE1BQU0sRUFBRSxZQUFZO2dCQUNwQixPQUFPLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixFQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsT0FBTzthQUMxRyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSw0QkFBTyxHQUFkLFVBQWUsU0FBa0I7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxPQUFPLENBQUM7WUFDcEgsT0FBTyxDQUFDLEdBQUcsQ0FBWSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDMUYsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLE9BQU8sQ0FBQztZQUN6SCxPQUFPLENBQUMsR0FBRyxDQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUMxRixNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFFRCxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLGNBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEMsQ0FBQztRQUVELEdBQUcsQ0FBQyxDQUFnQixVQUEyQixFQUEzQixLQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUEzQixjQUEyQixFQUEzQixJQUEyQjtZQUExQyxJQUFJLE9BQU8sU0FBQTtZQUNaLHNDQUFzQztZQUN0QyxPQUFPLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3RDO1FBRUQsNkVBQTZFO1FBQzdFLElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RCxJQUFNLEtBQUssR0FBRyxJQUFJLE9BQU8sRUFBOEIsQ0FBQztRQUN4RCxJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3RDLElBQU0sS0FBSyxHQUFHLElBQUksT0FBTyxFQUFTLENBQUM7UUFDbkMsSUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQU0sT0FBTyxHQUFzQixJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDcEcsSUFBSSxDQUFDLFVBQVUsR0FBb0MsRUFBRSxLQUFLLE9BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxXQUFXLGFBQUEsRUFBRSxDQUFDO1FBQ25HLEdBQUcsQ0FBQyxDQUFnQixVQUFlLEVBQWYsbUNBQWUsRUFBZiw2QkFBZSxFQUFmLElBQWU7WUFBOUIsSUFBSSxPQUFPLHdCQUFBO1lBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNqSDtRQUVELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDWixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUN4QixDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSwwQkFBSyxHQUFaLFVBQWEsSUFBVztRQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDTCxDQUFDO0lBRU8sNENBQXVCLEdBQS9CLFVBQ1EsS0FBMEMsRUFDMUMsT0FBd0IsRUFDeEIsS0FBcUIsRUFDckIsV0FBdUM7UUFKL0MsaUJBb0ZDO1FBL0VHLElBQUksT0FBTztRQUNILGdEQUFnRDtRQUNoRCxLQUFLO2FBRUEsU0FBUyxDQUFDLFVBQUEsT0FBTztZQUNkLHlCQUF5QjtZQUN6QixLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN2Qiw0REFBNEQ7WUFDNUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLO1lBQ25CLHdCQUF3QjtZQUN4QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7aUJBRXRCLE1BQU0sQ0FBQyxVQUFDLE1BQU0sRUFBRSxLQUFLO2dCQUNsQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QywyQkFBMkI7b0JBQzNCLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzlCLENBQUM7Z0JBQ0QseUNBQXlDO2dCQUN6QyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7cUJBRXZCLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO3FCQUV2QixTQUFTLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUNKO1lBQ0QscUNBQXFDO1lBQ3JDLE9BQU8sQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUEzQixDQUEyQixDQUFDO1lBQ3BELGNBQWM7WUFDZCxLQUFLLENBQ1IsQ0FBQztRQUNOLENBQUMsQ0FBQzthQUdELFNBQVMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUUvQixRQUFRLEVBQUUsQ0FBQztRQUV4QixzREFBc0Q7UUFDdEQsT0FBTyxDQUFDLFNBQVMsR0FBUSxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsbUJBQW1CO1lBQ2pFLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixZQUFZLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QixLQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDdkIsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLE9BQU8sSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDakMsQ0FBQztZQUNMLENBQUM7WUFFRCx1REFBdUQ7WUFDdkQsc0ZBQXNGO1lBQ3RGLElBQUksR0FBRyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQztZQUM1QixLQUFLLEdBQUcsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFFOUIsSUFBTSxPQUFPLEdBQTZCLEVBQUUsSUFBSSxNQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN4RyxJQUFNLFNBQVMsR0FBRyxVQUFDLFNBQVM7Z0JBQ3hCLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDckIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQztZQUNGLE9BQU8sQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXpHLHVFQUF1RTtZQUN2RSxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLG1CQUFtQixDQUFDLFdBQVcsR0FBRyxjQUFNLE9BQUEsT0FBTyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsRUFBbEMsQ0FBa0MsQ0FBQztZQUMvRSxDQUFDO1lBRUQseURBQXlEO1lBQ3pELE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFFdkUsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUUxQix3SEFBd0g7WUFDeEgsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDeEIsS0FBSSxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDbEMsS0FBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUNqQyxDQUFDO1lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFFTyx3Q0FBbUIsR0FBM0IsVUFBNEIsT0FBaUM7UUFBN0QsaUJBMERDO1FBekRHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLHdDQUF3QztZQUN4QyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDekIsb0RBQW9EO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRSxFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDeEQsQ0FBQztZQUNMLENBQUM7WUFFRCw0RUFBNEU7WUFDNUUsdURBQXVEO1lBQ3ZELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQXpCLENBQXlCLENBQUMsQ0FBQztZQUNwRixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUN4Qjt3QkFDSSxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNuQixLQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDM0IsQ0FBQyxFQUNELFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxxQkFBcUI7UUFDckIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUN4QjtvQkFDSSxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQixLQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDM0IsQ0FBQyxFQUNELFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFTyw0QkFBTyxHQUFmLFVBQWdCLFFBQWlCO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDbkMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakMsQ0FBQztRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUMvQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUVoQix1REFBdUQ7UUFDdkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1osSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixDQUFDO0lBQ0wsQ0FBQztJQWhaRDs7T0FFRztJQUNZLG9CQUFTLEdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztJQThZakQsaUJBQUM7Q0FsWkQsQUFrWkMsSUFBQTtTQWxaWSxVQUFVIiwiZmlsZSI6InF1ZXJ5LWNhY2hlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==