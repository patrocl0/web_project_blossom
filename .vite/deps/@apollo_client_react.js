import {
  NetworkStatus,
  Trie,
  __DEV__,
  asapScheduler,
  canUseDOM,
  canonicalStringify,
  createFulfilledPromise,
  createRejectedPromise,
  decoratePromise,
  equal,
  filter,
  invariant,
  maybe,
  maybeDeepFreeze,
  mergeOptions,
  observeOn,
  preventUnhandledRejection
} from "./chunk-VV7QEEJE.js";
import {
  require_react
} from "./chunk-3VDXVL42.js";
import {
  __toESM
} from "./chunk-5WRI5ZAA.js";

// node_modules/@apollo/client/react/context/ApolloContext.js
var React = __toESM(require_react(), 1);
var contextKey = Symbol.for("__APOLLO_CONTEXT__");
function getApolloContext() {
  invariant("createContext" in React, 37);
  let context = React.createContext[contextKey];
  if (!context) {
    Object.defineProperty(React.createContext, contextKey, {
      value: context = React.createContext({}),
      enumerable: false,
      writable: false,
      configurable: true
    });
    context.displayName = "ApolloContext";
  }
  return context;
}

// node_modules/@apollo/client/react/context/ApolloProvider.js
var React2 = __toESM(require_react(), 1);
var ApolloProvider = ({ client, children }) => {
  const ApolloContext = getApolloContext();
  const parentContext = React2.useContext(ApolloContext);
  const context = React2.useMemo(() => {
    return {
      ...parentContext,
      client: client || parentContext.client
    };
  }, [parentContext, client]);
  invariant(context.client, 38);
  return React2.createElement(ApolloContext.Provider, { value: context }, children);
};

// node_modules/@apollo/client/react/hooks/useApolloClient.js
var React3 = __toESM(require_react(), 1);
function useApolloClient(override) {
  const context = React3.useContext(getApolloContext());
  const client = override || context.client;
  invariant(!!client, 28);
  return client;
}

// node_modules/@apollo/client/react/hooks/useLazyQuery.js
var React10 = __toESM(require_react(), 1);

// node_modules/@apollo/client/react/hooks/internal/useDeepMemo.js
var React4 = __toESM(require_react(), 1);
function useDeepMemo(memoFn, deps) {
  const ref = React4.useRef(void 0);
  if (!ref.current || !equal(ref.current.deps, deps)) {
    ref.current = { value: memoFn(), deps };
  }
  return ref.current.value;
}

// node_modules/@apollo/client/react/hooks/internal/useRenderGuard.js
var React5 = __toESM(require_react(), 1);
var Ctx;
function noop() {
}
function useRenderGuard() {
  if (!Ctx) {
    Ctx = React5.createContext(null);
  }
  return React5.useCallback(
    /**
     * @returns true if the hook was called during render
     */
    () => {
      const orig = console.error;
      try {
        console.error = noop;
        React5["useContext"](Ctx);
        return true;
      } catch (e) {
        return false;
      } finally {
        console.error = orig;
      }
    },
    []
  );
}

// node_modules/@apollo/client/react/hooks/internal/__use.js
var React6 = __toESM(require_react(), 1);
var useKey = "use";
var realHook = React6[useKey];
var __use = realHook || function __use2(promise) {
  const decoratedPromise = decoratePromise(promise);
  switch (decoratedPromise.status) {
    case "pending":
      throw decoratedPromise;
    case "rejected":
      throw decoratedPromise.reason;
    case "fulfilled":
      return decoratedPromise.value;
  }
};

// node_modules/@apollo/client/react/hooks/internal/wrapHook.js
var React7 = __toESM(require_react(), 1);

// node_modules/@apollo/client/react/internal/cache/FragmentReference.js
var FragmentReference = class {
  observable;
  key = {};
  promise;
  resolve;
  reject;
  subscription;
  listeners = /* @__PURE__ */ new Set();
  autoDisposeTimeoutId;
  references = 0;
  constructor(client, watchFragmentOptions, options) {
    this.dispose = this.dispose.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleError = this.handleError.bind(this);
    this.observable = client.watchFragment(watchFragmentOptions);
    if (options.onDispose) {
      this.onDispose = options.onDispose;
    }
    const diff = this.getDiff(client, watchFragmentOptions);
    const startDisposeTimer = () => {
      if (!this.references) {
        this.autoDisposeTimeoutId = setTimeout(this.dispose, options.autoDisposeTimeoutMs ?? 3e4);
      }
    };
    this.promise = diff.complete ? createFulfilledPromise(diff.result) : this.createPendingPromise();
    this.subscribeToFragment();
    this.promise.then(startDisposeTimer, startDisposeTimer);
  }
  listen(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  retain() {
    this.references++;
    clearTimeout(this.autoDisposeTimeoutId);
    let disposed = false;
    return () => {
      if (disposed) {
        return;
      }
      disposed = true;
      this.references--;
      setTimeout(() => {
        if (!this.references) {
          this.dispose();
        }
      });
    };
  }
  dispose() {
    this.subscription.unsubscribe();
  }
  onDispose() {
  }
  subscribeToFragment() {
    this.subscription = this.observable.subscribe(this.handleNext.bind(this), this.handleError.bind(this));
    this.subscription.add(this.onDispose);
  }
  handleNext(result) {
    switch (this.promise.status) {
      case "pending": {
        if (result.complete) {
          return this.resolve?.(result.data);
        }
        this.deliver(this.promise);
        break;
      }
      case "fulfilled": {
        if (equal(this.promise.value, result.data)) {
          return;
        }
        this.promise = result.complete ? createFulfilledPromise(result.data) : this.createPendingPromise();
        this.deliver(this.promise);
      }
    }
  }
  handleError(error) {
    this.reject?.(error);
  }
  deliver(promise) {
    this.listeners.forEach((listener) => listener(promise));
  }
  createPendingPromise() {
    return decoratePromise(new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    }));
  }
  getDiff(client, options) {
    const { cache } = client;
    const { from, fragment, fragmentName } = options;
    const diff = cache.diff({
      ...options,
      query: cache["getFragmentDoc"](client["transform"](fragment), fragmentName),
      returnPartialData: true,
      id: from,
      optimistic: true
    });
    return {
      ...diff,
      result: client["queryManager"].maskFragment({
        fragment,
        fragmentName,
        data: diff.result
      })
    };
  }
};

// node_modules/@apollo/client/react/internal/cache/QueryReference.js
var QUERY_REFERENCE_SYMBOL = Symbol.for("apollo.internal.queryRef");
var PROMISE_SYMBOL = Symbol.for("apollo.internal.refPromise");
function wrapQueryRef(internalQueryRef) {
  return {
    [QUERY_REFERENCE_SYMBOL]: internalQueryRef,
    [PROMISE_SYMBOL]: internalQueryRef.promise
  };
}
function assertWrappedQueryRef(queryRef) {
  invariant(!queryRef || QUERY_REFERENCE_SYMBOL in queryRef, 27);
}
function getWrappedPromise(queryRef) {
  const internalQueryRef = unwrapQueryRef(queryRef);
  return internalQueryRef.promise.status === "fulfilled" ? internalQueryRef.promise : queryRef[PROMISE_SYMBOL];
}
function unwrapQueryRef(queryRef) {
  return queryRef[QUERY_REFERENCE_SYMBOL];
}
function updateWrappedQueryRef(queryRef, promise) {
  queryRef[PROMISE_SYMBOL] = promise;
}
var OBSERVED_CHANGED_OPTIONS = [
  "context",
  "errorPolicy",
  "fetchPolicy",
  "refetchWritePolicy",
  "returnPartialData"
];
var InternalQueryReference = class {
  result;
  key = {};
  observable;
  promise;
  subscription;
  listeners = /* @__PURE__ */ new Set();
  autoDisposeTimeoutId;
  resolve;
  reject;
  references = 0;
  softReferences = 0;
  constructor(observable, options) {
    this.handleNext = this.handleNext.bind(this);
    this.dispose = this.dispose.bind(this);
    this.observable = observable;
    if (options.onDispose) {
      this.onDispose = options.onDispose;
    }
    this.setResult();
    this.subscribeToQuery();
    const startDisposeTimer = () => {
      if (!this.references) {
        this.autoDisposeTimeoutId = setTimeout(this.dispose, options.autoDisposeTimeoutMs ?? 3e4);
      }
    };
    this.promise.then(startDisposeTimer, startDisposeTimer);
  }
  get disposed() {
    return this.subscription.closed;
  }
  get watchQueryOptions() {
    return this.observable.options;
  }
  reinitialize() {
    const { observable } = this;
    const originalFetchPolicy = this.watchQueryOptions.fetchPolicy;
    const avoidNetworkRequests = originalFetchPolicy === "no-cache" || originalFetchPolicy === "standby";
    try {
      if (avoidNetworkRequests) {
        observable.applyOptions({ fetchPolicy: "standby" });
      } else {
        observable.reset();
        observable.applyOptions({ fetchPolicy: "cache-first" });
      }
      if (!avoidNetworkRequests) {
        this.setResult();
      }
      this.subscribeToQuery();
    } finally {
      observable.applyOptions({ fetchPolicy: originalFetchPolicy });
    }
  }
  retain() {
    this.references++;
    clearTimeout(this.autoDisposeTimeoutId);
    let disposed = false;
    return () => {
      if (disposed) {
        return;
      }
      disposed = true;
      this.references--;
      setTimeout(() => {
        if (!this.references) {
          this.dispose();
        }
      });
    };
  }
  softRetain() {
    this.softReferences++;
    let disposed = false;
    return () => {
      if (disposed) {
        return;
      }
      disposed = true;
      this.softReferences--;
      setTimeout(() => {
        if (!this.softReferences && !this.references) {
          this.dispose();
        }
      });
    };
  }
  didChangeOptions(watchQueryOptions) {
    return OBSERVED_CHANGED_OPTIONS.some((option) => option in watchQueryOptions && !equal(this.watchQueryOptions[option], watchQueryOptions[option]));
  }
  applyOptions(watchQueryOptions) {
    const { fetchPolicy: currentFetchPolicy } = this.watchQueryOptions;
    if (currentFetchPolicy === "standby" && currentFetchPolicy !== watchQueryOptions.fetchPolicy) {
      this.initiateFetch(this.observable.reobserve(watchQueryOptions));
    } else {
      this.observable.applyOptions(watchQueryOptions);
    }
    return this.promise;
  }
  listen(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  refetch(variables) {
    return this.initiateFetch(this.observable.refetch(variables));
  }
  fetchMore(options) {
    return this.initiateFetch(this.observable.fetchMore(options));
  }
  dispose() {
    this.subscription.unsubscribe();
  }
  onDispose() {
  }
  handleNext(result) {
    switch (this.promise.status) {
      case "pending": {
        if (result.data === void 0) {
          result.data = this.result.data;
          if (result.data) {
            result.dataState = "complete";
          }
        }
        if (this.shouldReject(result)) {
          this.reject?.(result.error);
        } else {
          this.result = result;
          this.resolve?.(result);
        }
        break;
      }
      default: {
        if (result.data === this.result.data && result.networkStatus === this.result.networkStatus) {
          return;
        }
        if (result.data === void 0) {
          result.data = this.result.data;
        }
        if (this.shouldReject(result)) {
          this.promise = createRejectedPromise(result.error);
          this.deliver(this.promise);
        } else {
          this.result = result;
          this.promise = createFulfilledPromise(result);
          this.deliver(this.promise);
        }
        break;
      }
    }
  }
  deliver(promise) {
    this.listeners.forEach((listener) => listener(promise));
  }
  initiateFetch(returnedPromise) {
    this.promise = this.createPendingPromise();
    this.promise.catch(() => {
    });
    returnedPromise.then(() => {
      setTimeout(() => {
        if (this.promise.status === "pending") {
          this.result = this.observable.getCurrentResult();
          this.resolve?.(this.result);
        }
      });
    }).catch((error) => this.reject?.(error));
    return returnedPromise;
  }
  subscribeToQuery() {
    this.subscription = this.observable.pipe(filter((result) => !equal(result, this.result))).subscribe(this.handleNext);
    this.subscription.add(this.onDispose);
  }
  setResult() {
    const result = this.observable.getCurrentResult();
    if (equal(result, this.result)) {
      return;
    }
    this.result = result;
    this.promise = result.data ? createFulfilledPromise(result) : this.createPendingPromise();
  }
  shouldReject(result) {
    const { errorPolicy = "none" } = this.watchQueryOptions;
    return result.error && errorPolicy === "none";
  }
  createPendingPromise() {
    return decoratePromise(new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    }));
  }
};

// node_modules/@apollo/client/react/internal/cache/SuspenseCache.js
var SuspenseCache = class {
  queryRefs = new Trie();
  fragmentRefs = new Trie();
  options;
  constructor(options = {}) {
    this.options = options;
  }
  getQueryRef(cacheKey, createObservable) {
    const ref = this.queryRefs.lookupArray(cacheKey);
    if (!ref.current) {
      ref.current = new InternalQueryReference(createObservable(), {
        autoDisposeTimeoutMs: this.options.autoDisposeTimeoutMs,
        onDispose: () => {
          delete ref.current;
        }
      });
    }
    return ref.current;
  }
  getFragmentRef(cacheKey, client, options) {
    const ref = this.fragmentRefs.lookupArray(cacheKey);
    if (!ref.current) {
      ref.current = new FragmentReference(client, options, {
        autoDisposeTimeoutMs: this.options.autoDisposeTimeoutMs,
        onDispose: () => {
          delete ref.current;
        }
      });
    }
    return ref.current;
  }
  add(cacheKey, queryRef) {
    const ref = this.queryRefs.lookupArray(cacheKey);
    ref.current = queryRef;
  }
};

// node_modules/@apollo/client/react/internal/cache/getSuspenseCache.js
var suspenseCacheSymbol = Symbol.for("apollo.suspenseCache");
function getSuspenseCache(client) {
  if (!client[suspenseCacheSymbol]) {
    client[suspenseCacheSymbol] = new SuspenseCache(client.defaultOptions.react?.suspense);
  }
  return client[suspenseCacheSymbol];
}

// node_modules/@apollo/client/react/internal/index.js
var wrapperSymbol = Symbol.for("apollo.hook.wrappers");

// node_modules/@apollo/client/react/hooks/internal/wrapHook.js
function wrapHook(hookName, useHook, clientOrObsQuery) {
  const wrapperSources = [
    clientOrObsQuery["queryManager"],
    // if we are a hook (not `preloadQuery`), we are guaranteed to be inside of
    // a React render and can use context
    hookName.startsWith("use") ? (
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React7.useContext(getApolloContext())
    ) : void 0
  ];
  let wrapped = useHook;
  for (const source of wrapperSources) {
    const wrapper = source?.[wrapperSymbol]?.[hookName];
    if (wrapper) {
      wrapped = wrapper(wrapped);
    }
  }
  return wrapped;
}

// node_modules/@apollo/client/react/hooks/internal/useIsomorphicLayoutEffect.js
var React8 = __toESM(require_react(), 1);
var useIsomorphicLayoutEffect = canUseDOM ? React8.useLayoutEffect : React8.useEffect;

// node_modules/@apollo/client/react/hooks/useSyncExternalStore.js
var React9 = __toESM(require_react(), 1);
var didWarnUncachedGetSnapshot = false;
var uSESKey = "useSyncExternalStore";
var realHook2 = React9[uSESKey];
var isReactNative = maybe(() => navigator.product) == "ReactNative";
var usingJSDOM = (
  // Following advice found in this comment from @domenic (maintainer of jsdom):
  // https://github.com/jsdom/jsdom/issues/1537#issuecomment-229405327
  //
  // Since we control the version of Jest and jsdom used when running Apollo
  // Client tests, and that version is recent enought to include " jsdom/x.y.z"
  // at the end of the user agent string, I believe this case is all we need to
  // check. Testing for "Node.js" was recommended for backwards compatibility
  // with older version of jsdom, but we don't have that problem.
  maybe(() => navigator.userAgent.indexOf("jsdom") >= 0) || false
);
var canUseLayoutEffect = (canUseDOM || isReactNative) && !usingJSDOM;
var useSyncExternalStore = realHook2 || ((subscribe, getSnapshot, getServerSnapshot) => {
  const value = getSnapshot();
  if (
    // DEVIATION: Using __DEV__
    __DEV__ && !didWarnUncachedGetSnapshot && // DEVIATION: Not using Object.is because we know our snapshots will never
    // be exotic primitive values like NaN, which is !== itself.
    value !== getSnapshot()
  ) {
    didWarnUncachedGetSnapshot = true;
    invariant.error(34);
  }
  const [{ inst }, forceUpdate] = React9.useState({
    inst: { value, getSnapshot }
  });
  if (canUseLayoutEffect) {
    React9.useLayoutEffect(() => {
      Object.assign(inst, { value, getSnapshot });
      if (checkIfSnapshotChanged(inst)) {
        forceUpdate({ inst });
      }
    }, [subscribe, value, getSnapshot]);
  } else {
    Object.assign(inst, { value, getSnapshot });
  }
  React9.useEffect(() => {
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst });
    }
    return subscribe(function handleStoreChange() {
      if (checkIfSnapshotChanged(inst)) {
        forceUpdate({ inst });
      }
    });
  }, [subscribe]);
  return value;
});
function checkIfSnapshotChanged({ value, getSnapshot }) {
  try {
    return value !== getSnapshot();
  } catch {
    return true;
  }
}

// node_modules/@apollo/client/react/hooks/useLazyQuery.js
var EAGER_METHODS = [
  "refetch",
  "fetchMore",
  "updateQuery",
  "startPolling",
  "stopPolling",
  "subscribeToMore"
];
function useLazyQuery(query, options) {
  const client = useApolloClient(options?.client);
  const previousDataRef = React10.useRef(void 0);
  const resultRef = React10.useRef(void 0);
  const stableOptions = useDeepMemo(() => options, [options]);
  const calledDuringRender = useRenderGuard();
  function createObservable() {
    return client.watchQuery({
      ...options,
      query,
      initialFetchPolicy: options?.fetchPolicy,
      fetchPolicy: "standby"
    });
  }
  const [currentClient, setCurrentClient] = React10.useState(client);
  const [observable, setObservable] = React10.useState(createObservable);
  if (currentClient !== client) {
    setCurrentClient(client);
    setObservable(createObservable());
  }
  const updateResult = React10.useCallback((result2, forceUpdate) => {
    const previousData = resultRef.current?.data;
    if (previousData && !equal(previousData, result2.data)) {
      previousDataRef.current = previousData;
    }
    resultRef.current = result2;
    forceUpdate();
  }, []);
  const observableResult = useSyncExternalStore(React10.useCallback((forceUpdate) => {
    const subscription = observable.subscribe((result2) => {
      if (!equal(resultRef.current, result2)) {
        updateResult(result2, forceUpdate);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [observable, updateResult]), () => resultRef.current || initialResult, () => initialResult);
  const eagerMethods = React10.useMemo(() => {
    const eagerMethods2 = {};
    for (const key of EAGER_METHODS) {
      eagerMethods2[key] = function(...args) {
        invariant(resultRef.current, 29, key);
        return observable[key](...args);
      };
    }
    return eagerMethods2;
  }, [observable]);
  React10.useEffect(() => {
    const updatedOptions = {
      query,
      errorPolicy: stableOptions?.errorPolicy,
      refetchWritePolicy: stableOptions?.refetchWritePolicy,
      returnPartialData: stableOptions?.returnPartialData,
      notifyOnNetworkStatusChange: stableOptions?.notifyOnNetworkStatusChange,
      nextFetchPolicy: options?.nextFetchPolicy,
      skipPollAttempt: options?.skipPollAttempt
    };
    if (observable.options.fetchPolicy !== "standby" && stableOptions?.fetchPolicy) {
      updatedOptions.fetchPolicy = stableOptions.fetchPolicy;
    }
    observable.applyOptions(updatedOptions);
  }, [
    query,
    observable,
    stableOptions,
    // Ensure inline functions don't suffer from stale closures by checking for
    // these deps separately. @wry/equality doesn't compare function identity
    // so `stableOptions` isn't updated when using inline functions.
    options?.nextFetchPolicy,
    options?.skipPollAttempt
  ]);
  const execute = React10.useCallback((...args) => {
    invariant(!calledDuringRender(), 30);
    const [executeOptions] = args;
    let fetchPolicy = observable.options.fetchPolicy;
    if (fetchPolicy === "standby") {
      fetchPolicy = observable.options.initialFetchPolicy;
    }
    return observable.reobserve({
      fetchPolicy,
      // If `variables` is not given, reset back to empty variables by
      // ensuring the key exists in options
      variables: executeOptions?.variables,
      context: executeOptions?.context ?? {}
    });
  }, [observable, calledDuringRender]);
  const executeRef = React10.useRef(execute);
  useIsomorphicLayoutEffect(() => {
    executeRef.current = execute;
  });
  const stableExecute = React10.useCallback((...args) => executeRef.current(...args), []);
  const result = React10.useMemo(() => {
    const { partial, ...result2 } = observableResult;
    return {
      ...eagerMethods,
      ...result2,
      client,
      previousData: previousDataRef.current,
      variables: observable.variables,
      observable,
      called: !!resultRef.current
    };
  }, [client, observableResult, eagerMethods, observable]);
  return [stableExecute, result];
}
var initialResult = maybeDeepFreeze({
  data: void 0,
  dataState: "empty",
  loading: false,
  networkStatus: NetworkStatus.ready,
  partial: true
});

// node_modules/@apollo/client/react/hooks/useMutation.js
var React11 = __toESM(require_react(), 1);
function useMutation(mutation, options) {
  const client = useApolloClient(options?.client);
  const [result, setResult] = React11.useState(() => createInitialResult(client));
  const ref = React11.useRef({
    result,
    mutationId: 0,
    isMounted: true,
    client,
    mutation,
    options
  });
  useIsomorphicLayoutEffect(() => {
    Object.assign(ref.current, { client, options, mutation });
  });
  const execute = React11.useCallback((executeOptions = {}) => {
    const { options: options2, mutation: mutation2 } = ref.current;
    const baseOptions = { ...options2, mutation: mutation2 };
    const client2 = executeOptions.client || ref.current.client;
    if (!ref.current.result.loading && ref.current.isMounted) {
      setResult(ref.current.result = {
        loading: true,
        error: void 0,
        data: void 0,
        called: true,
        client: client2
      });
    }
    const mutationId = ++ref.current.mutationId;
    const clientOptions = mergeOptions(baseOptions, executeOptions);
    return preventUnhandledRejection(client2.mutate(clientOptions).then((response) => {
      const { data, error } = response;
      const onError = executeOptions.onError || ref.current.options?.onError;
      if (error && onError) {
        onError(error, clientOptions);
      }
      if (mutationId === ref.current.mutationId) {
        const result2 = {
          called: true,
          loading: false,
          data,
          error,
          client: client2
        };
        if (ref.current.isMounted && !equal(ref.current.result, result2)) {
          setResult(ref.current.result = result2);
        }
      }
      const onCompleted = executeOptions.onCompleted || ref.current.options?.onCompleted;
      if (!error) {
        onCompleted?.(response.data, clientOptions);
      }
      return response;
    }, (error) => {
      if (mutationId === ref.current.mutationId && ref.current.isMounted) {
        const result2 = {
          loading: false,
          error,
          data: void 0,
          called: true,
          client: client2
        };
        if (!equal(ref.current.result, result2)) {
          setResult(ref.current.result = result2);
        }
      }
      const onError = executeOptions.onError || ref.current.options?.onError;
      if (onError) {
        onError(error, clientOptions);
      }
      throw error;
    }));
  }, []);
  const reset = React11.useCallback(() => {
    if (ref.current.isMounted) {
      const result2 = createInitialResult(ref.current.client);
      Object.assign(ref.current, { mutationId: 0, result: result2 });
      setResult(result2);
    }
  }, []);
  React11.useEffect(() => {
    const current = ref.current;
    current.isMounted = true;
    return () => {
      current.isMounted = false;
    };
  }, []);
  return [execute, { reset, ...result }];
}
function createInitialResult(client) {
  return {
    data: void 0,
    error: void 0,
    called: false,
    loading: false,
    client
  };
}

// node_modules/@apollo/client/react/hooks/useQuery.js
var React12 = __toESM(require_react(), 1);

// node_modules/@apollo/client/react/hooks/constants.js
var skipToken = Symbol.for("apollo.skipToken");

// node_modules/@apollo/client/react/hooks/useQuery.js
var lastWatchOptions = Symbol();
function useQuery(query, ...[options]) {
  "use no memo";
  return wrapHook(
    "useQuery",
    // eslint-disable-next-line react-compiler/react-compiler
    useQuery_,
    useApolloClient(typeof options === "object" ? options.client : void 0)
  )(query, options);
}
function useQuery_(query, options = {}) {
  const client = useApolloClient(typeof options === "object" ? options.client : void 0);
  const { ssr } = typeof options === "object" ? options : {};
  const watchQueryOptions = useOptions(query, options, client.defaultOptions.watchQuery);
  function createState(previous) {
    const observable2 = client.watchQuery(watchQueryOptions);
    return {
      client,
      query,
      observable: observable2,
      resultData: {
        current: observable2.getCurrentResult(),
        // Reuse previousData from previous InternalState (if any) to provide
        // continuity of previousData even if/when the query or client changes.
        previousData: previous?.resultData.current.data,
        variables: observable2.variables
      }
    };
  }
  let [state, setState] = React12.useState(createState);
  if (client !== state.client || query !== state.query) {
    setState(state = createState(state));
  }
  const { observable, resultData } = state;
  useInitialFetchPolicyIfNecessary(watchQueryOptions, observable);
  useResubscribeIfNecessary(
    resultData,
    // might get mutated during render
    observable,
    // might get mutated during render
    watchQueryOptions
  );
  const result = useResult(observable, resultData, ssr);
  const obsQueryFields = React12.useMemo(() => ({
    refetch: observable.refetch.bind(observable),
    fetchMore: observable.fetchMore.bind(observable),
    updateQuery: observable.updateQuery.bind(observable),
    startPolling: observable.startPolling.bind(observable),
    stopPolling: observable.stopPolling.bind(observable),
    subscribeToMore: observable.subscribeToMore.bind(observable)
  }), [observable]);
  const previousData = resultData.previousData;
  return React12.useMemo(() => {
    const { partial, ...rest } = result;
    return {
      ...rest,
      client,
      observable,
      variables: observable.variables,
      previousData,
      ...obsQueryFields
    };
  }, [result, client, observable, previousData, obsQueryFields]);
}
var fromSkipToken = Symbol();
function useOptions(query, options, defaultOptions) {
  return useDeepMemo(() => {
    if (options === skipToken) {
      const opts = mergeOptions(defaultOptions, {
        query,
        fetchPolicy: "standby"
      });
      opts[fromSkipToken] = true;
      return opts;
    }
    const watchQueryOptions = mergeOptions(defaultOptions, { ...options, query });
    if (options.skip) {
      watchQueryOptions.initialFetchPolicy = options.initialFetchPolicy || options.fetchPolicy;
      watchQueryOptions.fetchPolicy = "standby";
    }
    return watchQueryOptions;
  }, [query, options, defaultOptions]);
}
function useInitialFetchPolicyIfNecessary(watchQueryOptions, observable) {
  "use no memo";
  if (!watchQueryOptions.fetchPolicy) {
    watchQueryOptions.fetchPolicy = observable.options.initialFetchPolicy;
  }
}
function useResult(observable, resultData, ssr) {
  "use no memo";
  return useSyncExternalStore(React12.useCallback((handleStoreChange) => {
    const subscription = observable.pipe(observeOn(asapScheduler)).subscribe((result) => {
      const previous = resultData.current;
      if (
        // Avoid rerendering if the result is the same
        equal(previous, result) && // Force rerender if the value was emitted because variables
        // changed, such as when calling `refetch(newVars)` which returns
        // the same data when `notifyOnNetworkStatusChange` is `false`.
        equal(resultData.variables, observable.variables)
      ) {
        return;
      }
      resultData.variables = observable.variables;
      if (previous.data && !equal(previous.data, result.data)) {
        resultData.previousData = previous.data;
      }
      resultData.current = result;
      handleStoreChange();
    });
    return () => {
      setTimeout(() => subscription.unsubscribe());
    };
  }, [observable, resultData]), () => resultData.current, () => ssr === false ? useQuery.ssrDisabledResult : resultData.current);
}
function useResubscribeIfNecessary(resultData, observable, watchQueryOptions) {
  "use no memo";
  if (observable[lastWatchOptions] && !equal(observable[lastWatchOptions], watchQueryOptions)) {
    if (observable[lastWatchOptions][fromSkipToken] && !watchQueryOptions.initialFetchPolicy) {
      watchQueryOptions.initialFetchPolicy = watchQueryOptions.fetchPolicy;
    }
    if (shouldReobserve(observable[lastWatchOptions], watchQueryOptions)) {
      observable.reobserve(watchQueryOptions);
    } else {
      observable.applyOptions(watchQueryOptions);
    }
    const result = observable.getCurrentResult();
    if (!equal(result.data, resultData.current.data)) {
      resultData.previousData = resultData.current.data || resultData.previousData;
    }
    resultData.current = result;
    resultData.variables = observable.variables;
  }
  observable[lastWatchOptions] = watchQueryOptions;
}
function shouldReobserve(previousOptions, options) {
  return previousOptions.query !== options.query || !equal(previousOptions.variables, options.variables) || previousOptions.fetchPolicy !== options.fetchPolicy && (options.fetchPolicy === "standby" || previousOptions.fetchPolicy === "standby");
}
useQuery.ssrDisabledResult = maybeDeepFreeze({
  loading: true,
  data: void 0,
  dataState: "empty",
  error: void 0,
  networkStatus: NetworkStatus.loading,
  partial: true
});

// node_modules/@apollo/client/react/hooks/useSubscription.js
var React13 = __toESM(require_react(), 1);
function useSubscription(subscription, ...[options = {}]) {
  const client = useApolloClient(options.client);
  const { skip, fetchPolicy, errorPolicy, shouldResubscribe, context, extensions, ignoreResults } = options;
  const variables = useDeepMemo(() => options.variables, [options.variables]);
  const recreate = () => createSubscription(client, subscription, variables, fetchPolicy, errorPolicy, context, extensions);
  let [observable, setObservable] = React13.useState(options.skip ? null : recreate);
  const recreateRef = React13.useRef(recreate);
  useIsomorphicLayoutEffect(() => {
    recreateRef.current = recreate;
  });
  if (skip) {
    if (observable) {
      setObservable(observable = null);
    }
  } else if (!observable || (client !== observable.__.client || subscription !== observable.__.query || fetchPolicy !== observable.__.fetchPolicy || errorPolicy !== observable.__.errorPolicy || !equal(variables, observable.__.variables)) && (typeof shouldResubscribe === "function" ? !!shouldResubscribe(options) : shouldResubscribe) !== false) {
    setObservable(observable = recreate());
  }
  const optionsRef = React13.useRef(options);
  React13.useEffect(() => {
    optionsRef.current = options;
  });
  const fallbackLoading = !skip && !ignoreResults;
  const fallbackResult = React13.useMemo(() => ({
    loading: fallbackLoading,
    error: void 0,
    data: void 0
  }), [fallbackLoading]);
  const ignoreResultsRef = React13.useRef(ignoreResults);
  useIsomorphicLayoutEffect(() => {
    ignoreResultsRef.current = ignoreResults;
  });
  const ret = useSyncExternalStore(React13.useCallback((update) => {
    if (!observable) {
      return () => {
      };
    }
    let subscriptionStopped = false;
    const client2 = observable.__.client;
    const subscription2 = observable.subscribe({
      next(value) {
        if (subscriptionStopped) {
          return;
        }
        const result = {
          loading: false,
          data: value.data,
          error: value.error
        };
        observable.__.setResult(result);
        if (!ignoreResultsRef.current)
          update();
        if (result.error) {
          optionsRef.current.onError?.(result.error);
        } else if (optionsRef.current.onData) {
          optionsRef.current.onData({
            client: client2,
            data: result
          });
        }
      },
      complete() {
        observable.__.completed = true;
        if (!subscriptionStopped && optionsRef.current.onComplete) {
          optionsRef.current.onComplete();
        }
      }
    });
    return () => {
      subscriptionStopped = true;
      setTimeout(() => subscription2.unsubscribe());
    };
  }, [observable]), () => observable && !skip && !ignoreResults ? observable.__.result : fallbackResult, () => fallbackResult);
  const restart = React13.useCallback(() => {
    invariant(!optionsRef.current.skip, 33);
    if (observable?.__.completed) {
      setObservable(recreateRef.current());
    } else {
      observable?.restart();
    }
  }, [optionsRef, recreateRef, observable]);
  return React13.useMemo(() => ({ ...ret, restart }), [ret, restart]);
}
function createSubscription(client, query, variables, fetchPolicy, errorPolicy, context, extensions) {
  const options = {
    query,
    variables,
    fetchPolicy,
    errorPolicy,
    context,
    extensions
  };
  const __ = {
    ...options,
    client,
    completed: false,
    result: {
      loading: true,
      data: void 0,
      error: void 0
    },
    setResult(result) {
      __.result = result;
    }
  };
  return Object.assign(client.subscribe(options), {
    /**
     * A tracking object to store details about the observable and the latest result of the subscription.
     */
    __
  });
}

// node_modules/@apollo/client/react/hooks/useReactiveVar.js
var React14 = __toESM(require_react(), 1);
function useReactiveVar(rv) {
  return useSyncExternalStore(React14.useCallback((update) => {
    return rv.onNextChange(function onNext() {
      update();
      rv.onNextChange(onNext);
    });
  }, [rv]), rv, rv);
}

// node_modules/@apollo/client/react/hooks/useFragment.js
var React15 = __toESM(require_react(), 1);
function useFragment(options) {
  "use no memo";
  return wrapHook(
    "useFragment",
    // eslint-disable-next-line react-compiler/react-compiler
    useFragment_,
    useApolloClient(options.client)
  )(options);
}
function useFragment_(options) {
  const client = useApolloClient(options.client);
  const { cache } = client;
  const { from, ...rest } = options;
  const id = React15.useMemo(() => typeof from === "string" ? from : from === null ? null : cache.identify(from), [cache, from]);
  const stableOptions = useDeepMemo(() => ({ ...rest, from: id }), [rest, id]);
  const diff = React15.useMemo(() => {
    const { fragment, fragmentName, from: from2, optimistic = true } = stableOptions;
    if (from2 === null) {
      return {
        result: diffToResult({
          result: {},
          complete: false
        })
      };
    }
    const { cache: cache2 } = client;
    const diff2 = cache2.diff({
      ...stableOptions,
      returnPartialData: true,
      id: from2,
      query: cache2["getFragmentDoc"](client["transform"](fragment), fragmentName),
      optimistic
    });
    return {
      result: diffToResult({
        ...diff2,
        result: client["queryManager"].maskFragment({
          fragment,
          fragmentName,
          // TODO: Revert to `diff.result` once `useFragment` supports `null` as
          // valid return value
          data: diff2.result === null ? {} : diff2.result
        })
      })
    };
  }, [client, stableOptions]);
  const getSnapshot = React15.useCallback(() => diff.result, [diff]);
  return useSyncExternalStore(React15.useCallback((forceUpdate) => {
    let lastTimeout = 0;
    const subscription = stableOptions.from === null ? null : client.watchFragment(stableOptions).subscribe({
      next: (result) => {
        if (equal(result, diff.result))
          return;
        diff.result = result;
        clearTimeout(lastTimeout);
        lastTimeout = setTimeout(forceUpdate);
      }
    });
    return () => {
      subscription?.unsubscribe();
      clearTimeout(lastTimeout);
    };
  }, [client, stableOptions, diff]), getSnapshot, getSnapshot);
}
function diffToResult(diff) {
  const result = {
    data: diff.result,
    complete: !!diff.complete,
    dataState: diff.complete ? "complete" : "partial"
  };
  if (diff.missing) {
    result.missing = diff.missing.missing;
  }
  return result;
}

// node_modules/@apollo/client/react/hooks/useSuspenseQuery.js
var React16 = __toESM(require_react(), 1);

// node_modules/@apollo/client/react/hooks/internal/validateSuspenseHookOptions.js
function validateSuspenseHookOptions(options) {
  const { fetchPolicy, returnPartialData } = options;
  validateFetchPolicy(fetchPolicy);
  validatePartialDataReturn(fetchPolicy, returnPartialData);
}
function validateFetchPolicy(fetchPolicy = "cache-first") {
  const supportedFetchPolicies = [
    "cache-first",
    "network-only",
    "no-cache",
    "cache-and-network"
  ];
  invariant(supportedFetchPolicies.includes(fetchPolicy), 35, fetchPolicy);
}
function validatePartialDataReturn(fetchPolicy, returnPartialData) {
  if (fetchPolicy === "no-cache" && returnPartialData) {
    __DEV__ && invariant.warn(36);
  }
}

// node_modules/@apollo/client/react/hooks/useSuspenseQuery.js
function useSuspenseQuery(query, options) {
  "use no memo";
  return wrapHook(
    "useSuspenseQuery",
    // eslint-disable-next-line react-compiler/react-compiler
    useSuspenseQuery_,
    useApolloClient(typeof options === "object" ? options.client : void 0)
  )(query, options ?? {});
}
function useSuspenseQuery_(query, options) {
  const client = useApolloClient(options.client);
  const suspenseCache = getSuspenseCache(client);
  const watchQueryOptions = useWatchQueryOptions({
    client,
    query,
    options
  });
  const { fetchPolicy, variables } = watchQueryOptions;
  const { queryKey = [] } = options;
  const cacheKey = [
    query,
    canonicalStringify(variables),
    ...[].concat(queryKey)
  ];
  const queryRef = suspenseCache.getQueryRef(cacheKey, () => client.watchQuery(watchQueryOptions));
  let [current, setPromise] = React16.useState([queryRef.key, queryRef.promise]);
  if (current[0] !== queryRef.key) {
    current[0] = queryRef.key;
    current[1] = queryRef.promise;
  }
  let promise = current[1];
  if (queryRef.didChangeOptions(watchQueryOptions)) {
    current[1] = promise = queryRef.applyOptions(watchQueryOptions);
  }
  React16.useEffect(() => {
    const dispose = queryRef.retain();
    const removeListener = queryRef.listen((promise2) => {
      setPromise([queryRef.key, promise2]);
    });
    return () => {
      removeListener();
      dispose();
    };
  }, [queryRef]);
  const skipResult = React16.useMemo(() => {
    const error = queryRef.result.error;
    const complete = !!queryRef.result.data;
    return {
      loading: false,
      data: queryRef.result.data,
      dataState: queryRef.result.dataState,
      networkStatus: error ? NetworkStatus.error : NetworkStatus.ready,
      error,
      complete,
      partial: !complete
    };
  }, [queryRef.result]);
  const result = fetchPolicy === "standby" ? skipResult : __use(promise);
  const fetchMore = React16.useCallback((options2) => {
    const promise2 = queryRef.fetchMore(options2);
    setPromise([queryRef.key, queryRef.promise]);
    return promise2;
  }, [queryRef]);
  const refetch = React16.useCallback((variables2) => {
    const promise2 = queryRef.refetch(variables2);
    setPromise([queryRef.key, queryRef.promise]);
    return promise2;
  }, [queryRef]);
  const subscribeToMore = queryRef.observable.subscribeToMore;
  return React16.useMemo(() => {
    return {
      client,
      data: result.data,
      dataState: result.dataState,
      error: result.error,
      networkStatus: result.networkStatus,
      fetchMore,
      refetch,
      subscribeToMore
    };
  }, [client, fetchMore, refetch, result, subscribeToMore]);
}
function useWatchQueryOptions({ client, query, options }) {
  return useDeepMemo(() => {
    if (options === skipToken) {
      return {
        query,
        fetchPolicy: "standby"
      };
    }
    const fetchPolicy = options.fetchPolicy || client.defaultOptions.watchQuery?.fetchPolicy || "cache-first";
    const watchQueryOptions = {
      ...options,
      fetchPolicy,
      query,
      notifyOnNetworkStatusChange: false,
      nextFetchPolicy: void 0
    };
    if (__DEV__) {
      validateSuspenseHookOptions(watchQueryOptions);
    }
    if (options.skip) {
      watchQueryOptions.fetchPolicy = "standby";
    }
    return watchQueryOptions;
  }, [client, options, query]);
}

// node_modules/@apollo/client/react/hooks/useBackgroundQuery.js
var React17 = __toESM(require_react(), 1);
function useBackgroundQuery(query, options) {
  "use no memo";
  return wrapHook(
    "useBackgroundQuery",
    // eslint-disable-next-line react-compiler/react-compiler
    useBackgroundQuery_,
    useApolloClient(typeof options === "object" ? options.client : void 0)
  )(query, options ?? {});
}
function useBackgroundQuery_(query, options) {
  const client = useApolloClient(options.client);
  const suspenseCache = getSuspenseCache(client);
  const watchQueryOptions = useWatchQueryOptions({ client, query, options });
  const { fetchPolicy, variables } = watchQueryOptions;
  const { queryKey = [] } = options;
  const didFetchResult = React17.useRef(fetchPolicy !== "standby");
  didFetchResult.current ||= fetchPolicy !== "standby";
  const cacheKey = [
    query,
    canonicalStringify(variables),
    ...[].concat(queryKey)
  ];
  const queryRef = suspenseCache.getQueryRef(cacheKey, () => client.watchQuery(watchQueryOptions));
  const [wrappedQueryRef, setWrappedQueryRef] = React17.useState(wrapQueryRef(queryRef));
  if (unwrapQueryRef(wrappedQueryRef) !== queryRef) {
    setWrappedQueryRef(wrapQueryRef(queryRef));
  }
  if (queryRef.didChangeOptions(watchQueryOptions)) {
    const promise = queryRef.applyOptions(watchQueryOptions);
    updateWrappedQueryRef(wrappedQueryRef, promise);
  }
  React17.useEffect(() => {
    const id = setTimeout(() => {
      if (queryRef.disposed) {
        suspenseCache.add(cacheKey, queryRef);
      }
    });
    return () => clearTimeout(id);
  });
  const fetchMore = React17.useCallback((options2) => {
    const promise = queryRef.fetchMore(options2);
    setWrappedQueryRef(wrapQueryRef(queryRef));
    return promise;
  }, [queryRef]);
  const refetch = React17.useCallback((variables2) => {
    const promise = queryRef.refetch(variables2);
    setWrappedQueryRef(wrapQueryRef(queryRef));
    return promise;
  }, [queryRef]);
  React17.useEffect(() => queryRef.softRetain(), [queryRef]);
  return [
    didFetchResult.current ? wrappedQueryRef : void 0,
    {
      fetchMore,
      refetch,
      // TODO: The internalQueryRef doesn't have TVariables' type information so we have to cast it here
      subscribeToMore: queryRef.observable.subscribeToMore
    }
  ];
}

// node_modules/@apollo/client/react/hooks/useSuspenseFragment.js
var React18 = __toESM(require_react(), 1);
var NULL_PLACEHOLDER = [];
function useSuspenseFragment(options) {
  "use no memo";
  return wrapHook(
    "useSuspenseFragment",
    // eslint-disable-next-line react-compiler/react-compiler
    useSuspenseFragment_,
    useApolloClient(typeof options === "object" ? options.client : void 0)
  )(options);
}
function useSuspenseFragment_(options) {
  const client = useApolloClient(options.client);
  const { from, variables } = options;
  const { cache } = client;
  const id = React18.useMemo(() => typeof from === "string" ? from : from === null ? null : cache.identify(from), [cache, from]);
  const fragmentRef = id === null ? null : getSuspenseCache(client).getFragmentRef([id, options.fragment, canonicalStringify(variables)], client, { ...options, variables, from: id });
  let [current, setPromise] = React18.useState(fragmentRef === null ? NULL_PLACEHOLDER : [fragmentRef.key, fragmentRef.promise]);
  React18.useEffect(() => {
    if (fragmentRef === null) {
      return;
    }
    const dispose = fragmentRef.retain();
    const removeListener = fragmentRef.listen((promise) => {
      setPromise([fragmentRef.key, promise]);
    });
    return () => {
      dispose();
      removeListener();
    };
  }, [fragmentRef]);
  if (fragmentRef === null) {
    return { data: null };
  }
  if (current[0] !== fragmentRef.key) {
    current[0] = fragmentRef.key;
    current[1] = fragmentRef.promise;
  }
  const data = __use(current[1]);
  return { data };
}

// node_modules/@apollo/client/react/hooks/useLoadableQuery.js
var React19 = __toESM(require_react(), 1);
function useLoadableQuery(query, options = {}) {
  const client = useApolloClient(options.client);
  const suspenseCache = getSuspenseCache(client);
  const watchQueryOptions = useWatchQueryOptions2({ client, query, options });
  const { queryKey = [] } = options;
  const [queryRef, setQueryRef] = React19.useState(null);
  assertWrappedQueryRef(queryRef);
  const internalQueryRef = queryRef && unwrapQueryRef(queryRef);
  if (queryRef && internalQueryRef?.didChangeOptions(watchQueryOptions)) {
    const promise = internalQueryRef.applyOptions(watchQueryOptions);
    updateWrappedQueryRef(queryRef, promise);
  }
  const calledDuringRender = useRenderGuard();
  const fetchMore = React19.useCallback((options2) => {
    if (!internalQueryRef) {
      throw new Error("The query has not been loaded. Please load the query.");
    }
    const promise = internalQueryRef.fetchMore(options2);
    setQueryRef(wrapQueryRef(internalQueryRef));
    return promise;
  }, [internalQueryRef]);
  const refetch = React19.useCallback((options2) => {
    if (!internalQueryRef) {
      throw new Error("The query has not been loaded. Please load the query.");
    }
    const promise = internalQueryRef.refetch(options2);
    setQueryRef(wrapQueryRef(internalQueryRef));
    return promise;
  }, [internalQueryRef]);
  const loadQuery = React19.useCallback((...args) => {
    invariant(!calledDuringRender(), 31);
    const [variables] = args;
    const cacheKey = [
      query,
      canonicalStringify(variables),
      ...[].concat(queryKey)
    ];
    const queryRef2 = suspenseCache.getQueryRef(cacheKey, () => client.watchQuery({
      ...watchQueryOptions,
      variables
    }));
    setQueryRef(wrapQueryRef(queryRef2));
  }, [
    query,
    queryKey,
    suspenseCache,
    watchQueryOptions,
    calledDuringRender,
    client
  ]);
  const subscribeToMore = React19.useCallback((options2) => {
    invariant(internalQueryRef, 32);
    return internalQueryRef.observable.subscribeToMore(
      // TODO: The internalQueryRef doesn't have TVariables' type information so we have to cast it here
      options2
    );
  }, [internalQueryRef]);
  const reset = React19.useCallback(() => {
    setQueryRef(null);
  }, []);
  return [loadQuery, queryRef, { fetchMore, refetch, reset, subscribeToMore }];
}
function useWatchQueryOptions2({ client, query, options }) {
  return useDeepMemo(() => {
    const fetchPolicy = options.fetchPolicy || client.defaultOptions.watchQuery?.fetchPolicy || "cache-first";
    const watchQueryOptions = {
      ...options,
      fetchPolicy,
      query,
      notifyOnNetworkStatusChange: false,
      nextFetchPolicy: void 0
    };
    if (__DEV__) {
      validateSuspenseHookOptions(watchQueryOptions);
    }
    return watchQueryOptions;
  }, [client, options, query]);
}

// node_modules/@apollo/client/react/hooks/useQueryRefHandlers.js
var React20 = __toESM(require_react(), 1);
function useQueryRefHandlers(queryRef) {
  "use no memo";
  const unwrapped = unwrapQueryRef(queryRef);
  const clientOrObsQuery = useApolloClient(unwrapped ? (
    // passing an `ObservableQuery` is not supported by the types, but it will
    // return any truthy value that is passed in as an override so we cast the result
    unwrapped["observable"]
  ) : void 0);
  return wrapHook(
    "useQueryRefHandlers",
    // eslint-disable-next-line react-compiler/react-compiler
    useQueryRefHandlers_,
    clientOrObsQuery
  )(queryRef);
}
function useQueryRefHandlers_(queryRef) {
  assertWrappedQueryRef(queryRef);
  const [previousQueryRef, setPreviousQueryRef] = React20.useState(queryRef);
  const [wrappedQueryRef, setWrappedQueryRef] = React20.useState(queryRef);
  const internalQueryRef = unwrapQueryRef(queryRef);
  if (previousQueryRef !== queryRef) {
    setPreviousQueryRef(queryRef);
    setWrappedQueryRef(queryRef);
  } else {
    updateWrappedQueryRef(queryRef, getWrappedPromise(wrappedQueryRef));
  }
  const refetch = React20.useCallback((variables) => {
    const promise = internalQueryRef.refetch(variables);
    setWrappedQueryRef(wrapQueryRef(internalQueryRef));
    return promise;
  }, [internalQueryRef]);
  const fetchMore = React20.useCallback((options) => {
    const promise = internalQueryRef.fetchMore(options);
    setWrappedQueryRef(wrapQueryRef(internalQueryRef));
    return promise;
  }, [internalQueryRef]);
  return {
    refetch,
    fetchMore,
    // TODO: The internalQueryRef doesn't have TVariables' type information so we have to cast it here
    subscribeToMore: internalQueryRef.observable.subscribeToMore
  };
}

// node_modules/@apollo/client/react/hooks/useReadQuery.js
var React21 = __toESM(require_react(), 1);
function useReadQuery(queryRef) {
  "use no memo";
  const unwrapped = unwrapQueryRef(queryRef);
  const clientOrObsQuery = useApolloClient(unwrapped ? (
    // passing an `ObservableQuery` is not supported by the types, but it will
    // return any truthy value that is passed in as an override so we cast the result
    unwrapped["observable"]
  ) : void 0);
  return wrapHook(
    "useReadQuery",
    // eslint-disable-next-line react-compiler/react-compiler
    useReadQuery_,
    clientOrObsQuery
  )(queryRef);
}
function useReadQuery_(queryRef) {
  assertWrappedQueryRef(queryRef);
  const internalQueryRef = React21.useMemo(() => unwrapQueryRef(queryRef), [queryRef]);
  const getPromise = React21.useCallback(() => getWrappedPromise(queryRef), [queryRef]);
  if (internalQueryRef.disposed) {
    internalQueryRef.reinitialize();
    updateWrappedQueryRef(queryRef, internalQueryRef.promise);
  }
  React21.useEffect(() => internalQueryRef.retain(), [internalQueryRef]);
  const promise = useSyncExternalStore(React21.useCallback((forceUpdate) => {
    return internalQueryRef.listen((promise2) => {
      updateWrappedQueryRef(queryRef, promise2);
      forceUpdate();
    });
  }, [internalQueryRef, queryRef]), getPromise, getPromise);
  const result = __use(promise);
  return React21.useMemo(() => {
    return {
      data: result.data,
      dataState: result.dataState,
      networkStatus: result.networkStatus,
      error: result.error
    };
  }, [result]);
}

// node_modules/@apollo/client/react/query-preloader/createQueryPreloader.js
function createQueryPreloader(client) {
  return wrapHook("createQueryPreloader", _createQueryPreloader, client)(client);
}
var _createQueryPreloader = (client) => {
  function preloadQuery(query, options = {}) {
    const queryRef = new InternalQueryReference(client.watchQuery({
      ...options,
      query,
      notifyOnNetworkStatusChange: false
    }), {
      autoDisposeTimeoutMs: client.defaultOptions.react?.suspense?.autoDisposeTimeoutMs
    });
    return wrapQueryRef(queryRef);
  }
  return Object.assign(preloadQuery, {
    toPromise(queryRef) {
      assertWrappedQueryRef(queryRef);
      return getWrappedPromise(queryRef).then(() => queryRef);
    }
  });
};

// node_modules/@apollo/client/react/index.js
var reactCompilerVersion = "uncompiled";
export {
  ApolloProvider,
  createQueryPreloader,
  getApolloContext,
  reactCompilerVersion,
  skipToken,
  useApolloClient,
  useBackgroundQuery,
  useFragment,
  useLazyQuery,
  useLoadableQuery,
  useMutation,
  useQuery,
  useQueryRefHandlers,
  useReactiveVar,
  useReadQuery,
  useSubscription,
  useSuspenseFragment,
  useSuspenseQuery
};
//# sourceMappingURL=@apollo_client_react.js.map
