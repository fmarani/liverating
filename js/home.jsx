var React = require("react");

var RatingApp = React.createClass({
    getInitialState: function() {
      return {
        display_mode: false,
      };
    },

    componentWillMount: function() {
    },

    displayRes: function() {
        console.log("displayRes");
       this.setState({display_mode: true});
    },
    displayRate: function() {
        console.log("displayRate");
       this.setState({display_mode: false});
    },

    render: function() {
        widget = <Display />
        if(!this.state.display_mode) {
            widget = <Rate />
        }

        return <div>
            <h1>live rating</h1>
            <div>
            <a onClick={this.displayRes}>Display results</a>
            </div>
            <div>
            <a onClick={this.displayRate}>Rate</a>
            </div>
            <div>
            {widget}
        </div>
            </div>;
    }
});

var Display = React.createClass({
    getInitialState: function() {
      return {
        data: {
            average: 0,
            ratings: {}
        },
      };
    },

        
    getData: function() {
        var that = this;
        fetch('/display.json', {
            credentials: 'same-origin'
        }).then(function(response) {
            return response.json()
          }).then(function(json) {
            console.log('parsed json', json)
            that.setState({data: json});
            setTimeout(that.getData, 3000);
          }).catch(function(ex) {
            console.log('parsing failed', ex)
          })
    },

    componentWillMount: function() {
        this.getData();
    },

    render: function() {
        return <div>
            <h2>display</h2>
            <div>
                average: {this.state.data.average}
            </div>
            <div>
                ratings: {this.state.data.ratings}
            </div>
            </div>;
    }
});

var Rate = React.createClass({
    rate: function(num) {
        console.log(num);
        fetch('/rate.json', {
          method: 'post',
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            num: num,
          })
        })
    },

    render: function() {
        return <div>
            <h2>rate</h2>
            <div>
            <a onClick={this.rate.bind(this, 1)}>1</a>
            </div>
            <div>
            <a onClick={this.rate.bind(this, 2)}>2</a>
            </div>
            <div>
            <a onClick={this.rate.bind(this, 3)}>3</a>
            </div>
            </div>;
    }
});

React.render(
    <RatingApp />,
    document.getElementById("render-main")
);
