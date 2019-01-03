#BMApp#
BMApp (Burning Man App) is a catalog of events for Burning Man. It is a Progressive Web App, designed to be used by off-line mobile devices that support service-workers and web-workers.

##TECH##
* Typescript
* SASS
* Inferno.js (Reactish framework)
* Redux
* Service-worker

The approach is functional-reactive with single-source-of-truth state management. To that end it uses RxJS and redux.

##DEV##
* Build everything and launch server: *npm run start*
* Compile typescript into javascript: *tsc*

##PRODUCTION##
* *Must dev compile first!*:*npm run start*
* Build everything: *npm run build*
* Launch server: *serve -s build*

###TODO###
* remove Google tracking
* remove Redux devtools extension

##DEPLOY##
1. *npm run start*
1. *npm run build*
1. *npm run deploy*
1. *cd ./deploy*
1. *git add .*
1. *git commit -m "some message"*
1. *git push*

##ROADMAP##
* When the components are working, displaying information properly and when they are asked, then use CSS to style them for a better user experience.
  e.g. The list of results into a scrollable, swipable, smaller container.
  e.g. The info display placard into a scrollable, swipable container.
* Use the map to display location.
* Ask user for location info, if they want to sort by distance.

##TESTS##
* *npm run test*

###TODO##
* Download of event data happens