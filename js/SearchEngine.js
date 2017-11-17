var BMInfoType;
(function (BMInfoType) {
    BMInfoType[BMInfoType["art"] = 0] = "art";
    BMInfoType[BMInfoType["camp"] = 1] = "camp";
    BMInfoType[BMInfoType["event"] = 2] = "event";
})(BMInfoType || (BMInfoType = {}));
var MessageType;
(function (MessageType) {
    // results = "results",
    MessageType["info"] = "info";
    MessageType["eventrange"] = "eventrange";
    MessageType["resultCount"] = "resultCount";
    MessageType["resultAdd"] = "resultAdd";
    MessageType["data"] = "data";
})(MessageType || (MessageType = {}));
var uniq = function (arr, uq, i) {
    if (uq === void 0) { uq = []; }
    if (i === void 0) { i = 0; }
    if (i >= arr.length)
        return uq;
    var newuq = uq.indexOf(arr[i]) === -1 ? uq.concat([arr[i]]) : uq;
    return uniq(arr, newuq, i + 1);
};
var getRange = function (arr) {
    // the functional recursive method threw a max call stack error.
    var low = Number.MAX_VALUE;
    var high = Number.MIN_VALUE;
    for (var i = 0; i < arr.length; i++) {
        var value = arr[i];
        if (value > high)
            high = value;
        if (value < low)
            low = value;
    }
    return [low, high];
};
var assoc = function (prop, value, obj) {
    var _clone = function (value, refFrom, refTo, deep) {
        if (refFrom === void 0) { refFrom = []; }
        if (refTo === void 0) { refTo = []; }
        if (deep === void 0) { deep = true; }
        var type = function (t) {
            if (typeof (t) === "object") {
                if (t === null)
                    return null;
                if (t.hasOwnProperty("length"))
                    return 'Array';
                if (t["toDateString"] !== undefined)
                    return 'Date';
                else
                    return 'Object';
            }
            else
                return t;
        };
        var copy = function (copiedValue) {
            var len = refFrom.length;
            var idx = 0;
            while (idx < len) {
                if (value === refFrom[idx]) {
                    return refTo[idx];
                }
                idx += 1;
            }
            refFrom[idx + 1] = value;
            refTo[idx + 1] = copiedValue;
            for (var key in value) {
                copiedValue[key] = deep ?
                    _clone(value[key], refFrom, refTo, true) : value[key];
            }
            return copiedValue;
        };
        switch (type(value)) {
            case 'Object': return copy({});
            case 'Array': return copy([]);
            case 'Date': return new Date(value.valueOf());
            default: return value;
        }
    };
    var cObj = _clone(obj);
    cObj[prop] = value; // cheating, but it's better than it was
    return cObj;
};
var isEmpty = function (a) { return a === undefined || a === null || a === "" || (a.hasOwnProperty("length") && a.length === 0); };
var isArt = function (i) { return i.hasOwnProperty("artist"); };
var isEvent = function (i) { return i.hasOwnProperty("event_id"); };
var isCamp = function (i) { return i.hasOwnProperty("contact_email") && !i.hasOwnProperty("artist"); };
var getType = function (i) { return isArt(i) ? 'art' : isEvent(i) ? 'event' : isCamp(i) ? 'camp' : ''; };
var getEventType = function (i) { return isEvent(i) ? isEmpty(i.event_type) ? '' : i.event_type.label : ''; };
var resultFromInfo = function (i) { return ({
    uid: i.uid,
    name: (i.name || i.title),
    type: isArt(i) ? BMInfoType.art : isEvent(i) ? BMInfoType.event : BMInfoType.camp,
    event_type: isEvent(i) ? i.event_type : undefined,
    location: isEmpty(i.location) ? undefined : i.location
}); };
var resultFromFuseResult = function (o) {
    var resultItem = resultFromInfo(o.item);
    var withMatches = assoc('matches', o.matches, resultItem);
    var withScore = assoc('score', o.score, withMatches);
    return withScore;
};
var SearchEngine = /** @class */ (function () {
    function SearchEngine(data, searchLib) {
        if (searchLib === void 0) { searchLib = Fuse; }
        var options = {
            shouldSort: true,
            findAllMatches: true,
            includeScore: true,
            includeMatches: true,
            threshold: 0.15,
            location: 0,
            distance: 1999,
            maxPatternLength: 32,
            minMatchCharLength: 10,
            keys: [
                {
                    "name": "name",
                    "weight": 0.5
                },
                {
                    "name": "title",
                    "weight": 0.5
                },
                {
                    "name": "description",
                    "weight": 0.375
                },
                {
                    "name": "artist",
                    "weight": 0.5
                },
                {
                    "name": "event_type.label",
                    "weight": 1
                },
                {
                    "name": "hometown",
                    "weight": 0.25
                },
                {
                    "name": "location.string",
                    "weight": 1
                },
                {
                    "name": "type",
                    "weight": 1
                }
            ]
        };
        var allInfo = data.arts.concat(data.camps).concat(data.events).map(function (i) { return assoc('type', getType(i), i); });
        var allWithDescriptions = allInfo.map(function (i) { return i.description === null ? assoc('description', "", i) : i; });
        var allUids = allWithDescriptions.map(function (i) { return i.uid; });
        //const allSearchData = allWithDescriptions.map((i) => `${i.title || i.name} ${i.description} ${i.print_description || ''} ${i.hometown || ''} ${i.artist || ''} ${getEventType(i)} ${getType(i)}`);
        var occs = data.events.filter(function (e) { return e.occurrence_set !== undefined; })
            .map(function (e) { return e.occurrence_set; }).reduceRight(function (a, b) { return a.concat(b); })
            .map(function (o) { return new Date(o.start_time).valueOf(); });
        var getIndex = function (uid) { return allUids.indexOf(uid); };
        var eventsAtTime = function (time) { return data.events.filter(function (e) { return e.occurrence_set !== undefined && e.occurrence_set.some(function (o) { return new Date(o.start_time).valueOf() <= time && new Date(o.end_time).valueOf() > time; }); }); };
        var eventsAtArt = function (art) { return data.events.filter(function (e) { return e.located_at_art === art.uid; }); };
        var eventsHostedByCamp = function (camp) { return data.events.filter(function (e) { return e.hosted_by_camp === camp.uid; }); };
        var getEventLocation = function (e) { return isEmpty(e.hosted_by_camp) ?
            isEmpty(e.located_at_art) ? undefined :
                getInfoById(e.located_at_art, false).location :
            getInfoById(e.hosted_by_camp, false).location; };
        var addEventLocation = function (i) { return (isEmpty(i) || isEmpty(i.location)) ? assoc('location', getEventLocation(i), i) : i; };
        // These create the View models with events added (if any)
        var fuse = new Fuse(allWithDescriptions, options); // "list" is the item array
        //var result = fuse.search("black rock travel agency");
        var search = function (term) { return fuse.search(term); };
        var getInfoByIndex = function (index) { return allInfo.find(function (i) { return i.uid === allUids[index]; }); };
        var getInfoById = function (uid, doExpand) {
            if (doExpand === void 0) { doExpand = true; }
            var idx = getIndex(uid);
            var i = getInfoByIndex(idx);
            //if (i===undefined) throw new Error(`undefined info call ${uid}`);
            if (i === undefined)
                return i;
            var info = i;
            if (doExpand && isArt(info)) {
                var artEvents = eventsAtArt(info);
                return assoc('events', artEvents, info);
            }
            if (doExpand && isCamp(info)) {
                var campEvents = eventsHostedByCamp(info);
                return assoc('events', campEvents, info);
            }
            if (isEvent(info)) {
                var event_1 = info;
                if (!isEmpty(event_1.hosted_by_camp)) {
                    var camp = getInfoById(event_1.hosted_by_camp, false);
                    var infoWithCamp = assoc('location', camp.location, info);
                    return assoc('camp', camp, infoWithCamp);
                }
                if (!isEmpty(event_1.located_at_art)) {
                    var art = getInfoById(event_1.located_at_art, false);
                    var infoWithArt = assoc('location', art.location, info);
                    return assoc('art', art, infoWithArt);
                }
            }
            return info;
        };
        this.getInfoById = getInfoById;
        this.eventRange = getRange(occs);
        //this.getResultsByTerm = (term: string) => search(term).map((r: { index: number, score: number }) => r.index).map((i: number) => getInfoByIndex(i)).map(addEventLocation).map(resultFromInfo);
        this.getResultsByTerm = function (term) { return search(term).map(resultFromFuseResult); };
        this.eventResultsAtTime = function (time) { return eventsAtTime(time).map(addEventLocation).map(resultFromInfo); };
    }
    return SearchEngine;
}());