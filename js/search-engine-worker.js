importScripts('fuse.min.js');
importScripts('Rx.min.js');
importScripts('SearchEngine.js');
var BUFFER_COUNT = 400;
var BUFFER_INTERVAL = 1000;
// emit results clustered in intervals
var resultSubscription = new Rx.BehaviorSubject(null);
var resultStreamSource = new Rx.Subject();
var newInterval = Rx.Observable.from(Rx.Observable.interval(100));
var resultStream = resultStreamSource.switch()
    .zip(Rx.Observable.interval(BUFFER_INTERVAL), function (a, b) { return a; })
    .map(function (x) { return x.filter(function (e) { return e.hasOwnProperty("uid"); }); });
var sendMessage = function (type, value) { messageSubj.next({ type: type, value: value }); };
var sendResults = function (results) {
    //console.log("New results");
    sendMessage(MessageType.resultCount, results.length);
    sendMessage(MessageType.resultAll, results);
    // if (resultSubscription.value !== null) resultSubscription.value!.unsubscribe();
    // if (results.length === 0) return;
    // const rem = BUFFER_COUNT - results.length % BUFFER_COUNT;
    // const fill = Array(rem).fill({});
    // const resultsAndFill = results.concat(fill);
    // //const allResultSub:Rx.Observable<BMResultItem> =  ;
    // const resSubVal = resultStream.subscribe(r => sendMessage(MessageType.resultAdd, r));
    // resultSubscription.next(resSubVal);
    // const restultObs = Rx.Observable.from(resultsAndFill).bufferCount(BUFFER_COUNT)
    // resultStreamSource.next(restultObs);
};
var messageSubj = Rx.Subject.create()
    .debounceTime(35).subscribe(function (msg) { return self.postMessage(msg); });
var se;
self.onerror = function (e) { return console.error(e); };
var messageEventHandler = function (x) {
    var msg = x.data;
    if (msg.type !== MessageType.data && se === undefined)
        return; // or throw error?
    var handleMessages = function (msgType) {
        switch (msgType) {
            case 'data':
                se = new SearchEngine(msg.value);
                handleMessages('eventrange');
                break;
            case 'info':
                var uid = msg.value;
                var info = se.getInfoById(uid);
                if (info !== undefined)
                    sendMessage(MessageType.info, info);
                break;
            case 'query':
                try {
                    var term = msg.value;
                    var results_1 = se.getResultsByTerm(term);
                    sendResults(results_1);
                    //console.log(infos.map((val, i) => [val, results[i]]));
                    //sendMessage(MessageType.results, results);
                }
                catch (error) {
                    console.error("fromWorker", error);
                }
                break;
            case 'queryTime':
                var time = msg.value;
                var results = se.eventResultsAtTime(time);
                //const res: Message = { type: MessageType.results, value: results };
                //messageSubj.next(res);
                sendResults(results);
                break;
            case 'eventrange':
                sendMessage(MessageType.eventrange, se.eventRange);
                break;
            default:
                console.error("Unknown message type " + msg.type + " received by search-engine-worker.js", msg);
                break;
        }
    };
    handleMessages(msg.type);
};
self.onmessage = function (x) { return messageEventHandler(x); };