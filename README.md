# BMApp #

BMApp (Burning Man App) is a catalog of events for Burning Man. It is a Progressive Web App, designed to be used by off-line mobile devices that support service-workers and web-workers.

## TECH ##

* SASS
* Typescript
    * [RxJS](https://www.learnrxjs.io/)
    * [Ramda](https://ramdajs.com/)
* Inferno.js (Reactish framework)
* Redux
* Service-workers

The approach is functional-reactive with single-source-of-truth state management. To that end it uses RxJS and redux.

## DEV ##

* Build everything and launch server: *npm run start*
* Compile typescript into javascript: *tsc*

## PRODUCTION ##

* *Must dev compile first!*:*npm run start*
* Build everything: *npm run build*
* Launch server: *serve -s build*

### TODO ###

* remove Google tracking
* remove Redux devtools extension
* remove adult-oriented filter

## DEPLOY ##

1. *npm run start*
1. *npm run build*
1. *npm run deploy*
1. *cd ./deploy*
1. *git add .*
1. *git commit -m "some message"*
1. *git push*

The ./deploy subfolder contains a git submodule on Github. A Netlify trigger automatically posts it to the website.

## FEATURE ROADMAP ##

* Sort events by distance
    * Only ask user for location info after this request
    * Allow sort by distance from arbitrary location
* Reminder notifications for favorited events

## TESTS ##

* *npm run test*

### TODO ###

* Ensure download of event data

## STYLE, STANDARDS & NOMENCLATURE ##

* [Git commit messages](https://juffalow.com/other/write-good-git-commit-message) should follow the "write good commit message" standard
* Use the [OneFlow](https://www.endoflineblog.com/oneflow-a-git-branching-model-and-workflow) git branching model
* CSS classes follow the [SUIT](https://suitcss.github.io/) for CSS standard
    * *.u-utilities* are immutable
* Versioning
    * tag releases with the year (e.g. *2017*)
* Comments
    * try to explain "why" not "what"
    * (optional) keep commented-out code if it contributes to clarity and understanding, but can be freely deleted by a working developer as well

## STRUCTURE ##