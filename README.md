# [BMApp](https://garbage-collector-acronyms-27351.netlify.com/) #

BMApp (*B*urning *M*an *App*) is a catalog of events for Burning Man. It is a Progressive Web App, designed to be used by off-line mobile devices. It is currently [hosted by Netlify](https://garbage-collector-acronyms-27351.netlify.com/)

## SUPPORTED BROWSERS ##

These browsers or more recent:

* iOS Safari 11.4
* Chrome for Android 70
* Android Browser 67
* Chrome 45
* Safari 11.1
* Firefox 44
* Edge 17

## TECH ##

* [SASS](https://sass-lang.com/)
* [Typescript](https://www.typescriptlang.org/)
    * [RxJS](https://www.learnrxjs.io/)
    * [Ramda](https://ramdajs.com/)
* [Inferno.js](https://infernojs.org/) (If you know React, this will be familiar to you)
* [Redux](https://redux.js.org/)
* [Service-workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) for off-line function
* A [web-worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) generates search-engine results in a separate thread to keep the UI responsive
* [Fuse](http://fusejs.io) search-engine library

The approach is functional-reactive (RxJS) with single-source-of-truth state management (Redux)

## DEVELOPMENT ##

In order to:

* Build everything and launch server: *npm run start*
* Compile typescript into javascript: *tsc*

## PRODUCTION ##

In order to:

* Build everything: *npm run start && npm run build*
* Launch server: *serve -s build*

*TODO*

* remove Google tracking
* remove Redux devtools extension
* remove adult-oriented filter (i.e. enable by default)
* UI animation (using FLIP)

## DEPLOY ##

To deploy, follow these steps in turn:

1. *npm run start*
1. *npm run build*
1. *npm run deploy*
1. *cd ./deploy*
1. *git add .*
1. *git commit -m "some message"*
1. *git push*

The ./deploy subfolder contains a git submodule repo on Github. A Netlify trigger automatically posts it to [the website](https://garbage-collector-acronyms-27351.netlify.com/)

## FEATURE ROADMAP ##

* Sort events by distance
    * Only ask user for location info after this request
    * Allow sort by distance from arbitrary location
* Reminder notifications for favorited events

## TESTS ##

* *npm run test*

*TODO*

* Ensure download of event data

## STYLE, STANDARDS & NOMENCLATURE ##

* [Git commit messages](https://juffalow.com/other/write-good-git-commit-message) should follow the "write good commit message" standard
* Use the [OneFlow](https://www.endoflineblog.com/oneflow-a-git-branching-model-and-workflow) git branching model
* CSS classes follow the [SUIT](https://suitcss.github.io/) for CSS standard
    * *.u-utilities* are immutable
* Versioning
    * tag releases with the year (e.g. *2017*)
    * minor releases appended with *.[month].[date]*
    * more than 1 release in a day, append *.[24hourminute]*
* Comments
    * try to explain "why" not "what"
    * (optional) keep commented-out code if it contributes to clarity and understanding, but can be freely deleted by a working developer as well

## STRUCTURE ##

* *./src* directory contains all source code. Development occurs there.
* The app is written using [Inferno](https://infernojs.org) for [speed](https://infernojs.org/benchmarks). If you know React, Inferno will be familiar to you.
* App state is maintained via [Redux](https://redux.js.org/) found in *./src/app-store.ts*
    * *data*
    * *ui* contains UI state
* Build creates 3 .js files:
    * *search.js* is a [web-worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) that holds search functionality. It currently uses the [Fuse library](http://fusejs.io/). Source code is in *./src/searchengine/*.
    * *serviceWorker.js* is a [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) that caches most content so that the app can run off-line.
    * *main.js* is primarily the UI and entry-point.
* The search function is delegated to a [web-worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) so that the user interface can remain responsive.
* On the server, unknown pages (404) should redirect back to root so that *main.js* can process the URL.

## CONTRIBUTE ##

Wonderful! I particularly need help with UI.

1. Create a single issue describing the change you want to make.
1. Ask me for access to the private repository.
1. Fork it.
1. Submit a pull request.
