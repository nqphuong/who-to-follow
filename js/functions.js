var refreshButton = document.querySelector('.rxjs .refresh');
var closeButton1 = document.querySelector('.rxjs .close1');
var closeButton2 = document.querySelector('.rxjs .close2');
var closeButton3 = document.querySelector('.rxjs .close3');

var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
var close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
var close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
var close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');

//Evol1:
//Init the stream information which will be request data from url
//var requestStream = Rx.Observable.just('https://api.github.com/users');

//Evol2:
//Map request stream with refresh button click event
//The stream url will be updated
var requestStream = refreshClickStream
    .map(function(){
        var randomOffset = Math.floor(Math.random() * 500);
        return 'https://api.github.com/users?since=' + randomOffset;
    })
    //Evol3: Merge startup stream and on refresh stream together
    //=>the data is emitted on startup
    .startWith('https://api.github.com/users');

//Subscribe the stream from request url
requestStream.subscribe(function(requestUrl){
    //Evol1:
    //Get static data stream
    //jQuery.getJSON(requestUrl, function(responseData){
    //    console.log(responseData);
    //});
    
    //Evol1.2:
    //Get asynchronous data streams
    //var responseStream = Rx.Observable.create(function(observer){
    //    jQuery.getJSON(requestUrl)
    //    .done(function(response){observer.onNext(response);})
    //    .fail(function(jqXHR, status, err){observer.onError(err);})
    //    .always(function(){observer.onCompleted();});
    //});
    
    
});

//Evol2:
//Response stream is created out of the resquest stream with .map() function
//And the .flatMap() helps us to get simple stream responses instead of the pointer in .map()
var responseStream = requestStream.flatMap(function(requestUrl){
        return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
});
    
responseStream.subscribe(function(response){
    //console.log(response);
});

//Define 3 suggestion stream who get data from response stream
//var suggestion1Stream = responseStream
//    //Evol1: Get random user in list
//    .map(function(listUsers){
//        return listUsers[Math.floor(Math.random() * listUsers.length)];
//    })
//    //Evol2: Map refresh click to null suggestion
//    .merge(
//           refreshClickStream.map(function(){return null;})
//    )
//    //Evol3: Render empty suggestion on startup
//    .startWith(null);

var suggestion1Stream = close1ClickStream.startWith('statup click') //Evol5: add statrWith to get frist value emitted on startup
    //Evol4: combine response stream with random data in requested list
    .combineLatest(
        responseStream,
        function(click, listUsers){
            return listUsers[Math.floor(Math.random() * listUsers.length)];
        }
    )
    //Evol2: Map refresh click to null suggestion
    .merge(
           refreshClickStream.map(function(){return null;})
    )
    //Evol3: Render empty suggestion on startup
    .startWith(null);
    
var suggestion2Stream = close2ClickStream.startWith('statup click') //Evol5: add statrWith to get frist value emitted on startup
    //Evol4: combine response stream with random data in requested list
    .combineLatest(
        responseStream,
        function(click, listUsers){
            return listUsers[Math.floor(Math.random() * listUsers.length)];
        }
    )
    //Evol2: Map refresh click to null suggestion
    .merge(
        refreshClickStream.map(function(){return null;})
    )
    .startWith(null);
    
var suggestion3Stream = close3ClickStream.startWith('statup click') //Evol5: add statrWith to get frist value emitted on startup
    //Evol4: combine response stream with random data in requested list
    .combineLatest(
        responseStream,
        function(click, listUsers){
            return listUsers[Math.floor(Math.random() * listUsers.length)];
        }
    )
    //Evol2: Map refresh click to null suggestion
    .merge(
        refreshClickStream.map(function(){return null;})
    )
    //Evol3: Add null value to clear data on refresh
    .startWith(null);

//Subscribe suggestion stream
suggestion1Stream.subscribe(function(suggestion){
    renderSuggestion(suggestion, '.rxjs .sugg1');
});

suggestion2Stream.subscribe(function(suggestion){
    renderSuggestion(suggestion, '.rxjs .sugg2');
});

suggestion3Stream.subscribe(function(suggestion){
    renderSuggestion(suggestion, '.rxjs .sugg3');
});

function renderSuggestion(suggestion, classname) {
    var parentElement = $(classname);
    var parentElement2 = document.querySelector(classname);
    if (suggestion === null) {
        parentElement.css({'visibility':'hidden'});
    } else {
        parentElement.css({'visibility':'visible'});
        $(classname + ' img').attr("src", suggestion.avatar_url);
        $(classname + ' .username a').attr("href", suggestion.html_url);
        $(classname + ' .username a').text(suggestion.login);
        $(classname + ' .follow').attr("href", "unknown");
        
        //Get relative info
        var followerStream = Rx.Observable.fromPromise(jQuery.getJSON(suggestion.followers_url));
        followerStream.subscribe(function(response){
            $(classname + ' .relation .followers strong').text(response.length);
        });
        
        var starredStream = Rx.Observable.fromPromise(jQuery.getJSON( suggestion.starred_url.replace('{/owner}{/repo}', '')));
        starredStream.subscribe(function(response){
            $(classname + ' .relation .starred strong').text(response.length);
        });
        
        var followingStream = Rx.Observable.fromPromise(jQuery.getJSON(suggestion.following_url.replace('{/other_user}','')));
        followingStream.subscribe(function(response){
            $(classname + ' .relation .followings strong').text(response.length);
        });
    }
}