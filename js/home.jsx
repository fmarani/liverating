var React = require("react");
var Chart = require("react-google-charts").Chart;

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
            <span style={{padding: "10px"}}>
            <a className="btn btn-default" onClick={this.displayRes}>Display results</a>
            </span>
            <span style={{padding: "10px"}}>
            <a className="btn btn-default" onClick={this.displayRate}>Rate</a>
            </span>
            <div>
            {widget}
        </div>
            </div>;
    }
});

var Display = React.createClass({
    getInitialState: function() {
      return {
        averages: {}
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
            var averages = json.averages.map(function(row) {
                return [new Date(row[0]), row[1]];
            });
            that.setState({averages: averages});
            that.setState({timeout_id: setTimeout(that.getData, 5000)});
          }).catch(function(ex) {
            console.log('parsing failed', ex)
          })
    },

    componentWillMount: function() {
        this.getData();
    },

    componentWillUnmount: function() {
        clearTimeout(this.state.timeout_id);
    },

    render: function() {
        var options = {
            legend: 'none',
            vAxis: {
                minValue: 0,
                maxValue: 10
            }
        };
        var columns = [
            {
                'type': 'datetime',
                'label' : 'Time'
            }, 
            {
                'type' : 'number',
                'label' : 'Average rating'
            }
        ];

        return <div>
            <h2>display</h2>
            <Chart chartType="LineChart" rows={this.state.averages} columns={columns} options={options} width={"100%"} height={"300px"} graph_id="linechart_graph" />
            </div>;
    }
});

var Rate = React.createClass({
    getInitialState: function() {
      return {
          voted: false
      };
    },

    rate: function(num) {
        console.log(num);
        this.setState({voted: true});
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
        var msg = "";
        if(this.state.voted) {
            msg = <p>Your rating has been submitted. If you submit another, you will override the previous one.</p>
        }
        return <div>
            <h2>rate</h2>
            {msg}
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 1)}>1</a>
            </p>
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 2)}>2</a>
            </p>
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 3)}>3</a>
            </p>
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 4)}>4</a>
            </p>
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 5)}>5</a>
            </p>
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 6)}>6</a>
            </p>
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 7)}>7</a>
            </p>
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 8)}>8</a>
            </p>
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 9)}>9</a>
            </p>
            <p>
                <a className="btn btn-default" onClick={this.rate.bind(this, 10)}>10</a>
            </p>
            </div>;
    }
});

React.render(
    <RatingApp />,
    document.getElementById("render-main")
);
