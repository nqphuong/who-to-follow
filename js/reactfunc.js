
var SuggestionItem = React.createClass({
    countFollowers: function(){
        $.ajax({
            url:this.props.followers_url,
            type:'get',
            data:{},
            success: function(data){
                console.log("followers: "); console.log(data);
                this.setState({num_followers:data.length});
            }.bind(this),
            error: function(xhr, status, err){
                console.log('Err: Cannot read info followers. Code status: ', status, err.toString());
            }.bind(this)
        });
    },
    countStarred: function(){
        $.ajax({
            url:this.props.starred_url,
            type:'get',
            data:{},
            success: function(data){
                console.log("starred: "); console.log(data);
                this.setState({num_starred:data.length});
            }.bind(this),
            error: function(xhr, status, err){
                console.log('Err: Cannot read info starred. Code status: ', status, err.toString());
            }.bind(this)
        });
    },
    countFollowings: function(){
        $.ajax({
            url:this.props.following_url,
            type:'get',
            data:{},
            success: function(data){
                console.log("followings: "); console.log(data);
                this.setState({num_followings:data.length});
            }.bind(this),
            error: function(xhr, status, err){
                console.log('Err: Cannot read info following. Code status: ', status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function(){
        this.countFollowers();
        this.countStarred();
        this.countFollowings();
    },
    getInitialState: function(){
        return{
            num_followers:0,
            num_starred:0,
            num_followings:0
        };
    },
    render: function(){
        return(
            <li className="s-item">
                <div className="overlay">
                    <a href="#" className="close">x</a>
                </div>
                <img className="avatar" src={this.props.avatar_url}/>
                <div className="acc-info">
                    <div className="username">
                        <a href={this.props.git_url} target="_blank">{this.props.username}</a>
                    </div>
                    <a href="#" className="follow">
                        <span className="fa fa-user fa-2x"></span>
                        Follow
                    </a>
                </div>
                <div className="relation">
                    <div className="rel-item followers">
                        <strong>{this.state.num_followers}</strong>
                        <div>Followers</div>
                    </div>
                    <div className="rel-item starred">
                        <strong>{this.state.num_starred}</strong>
                        <div>Starred</div>
                    </div>
                    <div className="rel-item followings">
                        <strong>{this.state.num_followings}</strong>
                        <div>Followings</div>
                    </div>
                </div>
            </li>
        );
    }
});

var SuggestionList = React.createClass({
    render: function(){
        var users = this.props.data.map(function(detail, index){
            return(
                <SuggestionItem username={detail.login}
                                avatar_url={detail.avatar_url}
                                git_url={detail.html_url}
                                followers_url={detail.followers_url}
                                starred_url={detail.starred_url.replace('{/owner}{/repo}', '')}
                                following_url={detail.following_url.replace('{/other_user}','')}/>
            );
        });
        
        return(
            <ul class="suggestion">
                {users}
            </ul>
        );
    }    
});

var SuggestionBox = React.createClass({
    loadDataFromServer: function(){
        $.ajax({
            url:this.props.url,
            type:'get',
            data:{},
            success: function(data){
                //Get 3 random users
                console.log(data);
                var subdata = [];
                for(var i=0; i < 3; i++){
                    subdata.push(data[Math.floor(Math.random() * data.length)]);
                }
                this.setState({data:subdata});
            }.bind(this),
            error: function(xhr, status, err){
                console.log('Err: Cannot acces to git server. ', status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function(){
        this.loadDataFromServer();
        
        //Add click action event
        jQuery('#refresh').bind("click", function(e){
            e.preventDefault();
            
            //Load data from server
            this.loadDataFromServer();
            
            return false;
        }.bind(this));
    },
    getInitialState: function(){
        return {
            data:[],
        };
    },
    render: function(){
        return (
            <div>
                <div className="header">
                    Who to follow
                    <span> . <a id="refresh" href="#" class="refresh">Refresh</a></span>
                    <span> . <a href="#">View all</a></span>
                </div>
                <SuggestionList data={this.state.data} />
            </div>
        );
    }
});

React.render(
    <SuggestionBox url='https://api.github.com/users'/>, document.getElementById('react')
)