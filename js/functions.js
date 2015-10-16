var refreshButton = document.querySelector('.refresh');
var closeButton1 = document.querySelector('.close1');
var closeButton2 = document.querySelector('.close2');
var closeButton3 = document.querySelector('.close3');

var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
var close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
var close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
var close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');

//Init the stream information which will be request data from url
var requestStream = Rx.Observable.just('https://api.github.com/users');

//Subscribe the stream from request url
requestStream.subscribe(function(requestUrl){
    //Get static data stream
    //jQuery.getJSON(requestUrl, function(responseData){
    //    console.log(responseData);
    //});
    
    //Get asynchronous data streams
    var responseStream = Rx.Observable.create(function(observer){
        jQuery.getJSON(requestUrl)
        .done(function(response){observer.onNext(response);})
        .fail(function(jqXHR, status, err){observer.onError(err);})
        .always(function(){observer.onCompleted();});
    });
    
    responseStream.subscribe(function(response){
        console.log(response);
    });
});

