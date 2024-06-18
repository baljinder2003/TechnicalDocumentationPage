// put the js in script tag while submitting to the FCC
function navclose() {
    const t = document.getElementById("closebutton");
    t.classList.toggle("button");
    t.innerHTML == "X" ?
        t.innerHTML = "-<br>-<br>-" :
        t.innerHTML = "X";
    document.getElementById("navbar").classList.toggle("navbar");
} 
const navbarHeight = document.querySelector('nav').offsetHeight;
/* NAVBAR SCROLL*/
document.addEventListener('DOMContentLoaded', () => {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (!isPortrait) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                const targetPosition = targetElement.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
});
// responsive svg dimensions
if (window.innerHeight > window.innerWidth) {
    var svgWidth = window.innerWidth / 1.2;
    var svgHeight = window.innerHeight / 1.2;
    navclose()
} 
else {
    var svgWidth = window.innerWidth /1.2;
    var svgHeight = (window.innerHeight / 1.12) - navbarHeight ;
}
var padding = 60;
// urls
let url1 = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let url2 = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let url3 = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let url4 = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
let url5 = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let url6 = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
// colors
const colors = [
    'rgb(0, 0, 180)',   // <= 3.9
    'rgb(69, 117, 180)',   // <= 5.0
    'rgb(116, 173, 209)',  // <= 6.1
    'rgb(171, 217, 233)',  // <= 7.2
    'rgb(224, 243, 248)',  // <= 8.3
    'rgb(255, 255, 191)',  // <= 9.5
    'rgb(254, 224, 144)',  // <= 10.6
    'rgb(253, 174, 97)',   // <= 11.7
    'rgb(244, 109, 67)',   // <= 12.8
    'rgb(215, 48, 39)'     // Else condition
];
// maps
document.addEventListener("DOMContentLoaded", () => {
    GetData();
    GetData2();
    GetData3();
    GetData4();
    GetData5();
});
let GetData = () => {
    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", url1, true);
    ajaxRequest.send();
    ajaxRequest.onload = () => {
        let responseDataset = JSON.parse(ajaxRequest.responseText).data;
        loadGraph(responseDataset);
    };
};
let GetData2 = () => {
    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", url2, true);
    ajaxRequest.send();
    ajaxRequest.onload = () => {
        let responseDataset = JSON.parse(ajaxRequest.responseText);
        loadGraph2(responseDataset);
    };
};
let GetData3 = () => {
    const ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", url3, true);
    ajaxRequest.send();
    ajaxRequest.onload = () => {
        let d = JSON.parse(ajaxRequest.responseText);
        loadGraph3(d);
    }
}
let GetData4 = () => {
    d3.json(url4).then(
        (data, error) => {
            if (error) {
                console.log(error)
            } else {
                loadGraph4(data)
            }
        }
    )
}
let GetData5 = () => {
    d3.json(url5).then(
        (data, error) => {
            if (error) {
                console.log(log)
            } else {
                let cData = topojson.feature(data, data.objects.counties).features
                d3.json(url6).then(
                    (data, error) => {
                        if (error) {
                            console.log(error)
                        } else {
                            loadGraph5(cData, data)
                        }
                    }
                )
            }
        }
    )
}
let loadGraph = (gdpDataset) => {
    let xScale = d3
        .scaleTime()
        .domain([
            d3.min(gdpDataset, (d) => new Date(d[0])),
            d3.max(gdpDataset, (d) => new Date(d[0]))
        ])
        .range([30, svgWidth - 30 - 10]);
    let yScale = d3
        .scaleLinear()
        .domain([0, d3.max(gdpDataset, (d) => d[1])])
        .range([svgHeight - 30, 30]);

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);
    let tooltip = d3.select("#bcsvg").append("div").attr("id", "tooltip");
    let svg = d3
        .select("#bcsvg")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${30}, ${svgHeight - 30})`)
        .call(xAxis);

    svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${2 * 30},0)`)
        .call(yAxis);

    svg
        .selectAll("rect")
        .data(gdpDataset)
        .enter()
        .append("rect")
        .attr("x", (d, i) => 30 + xScale(new Date(d[0])))
        .attr("y", (d, i) => yScale(d[1]))
        .attr("width", svgWidth / gdpDataset.length)
        .attr("height", (d, i) => svgHeight - 30 - yScale(d[1]))
        .attr("fill", (d, i) => {
            if (i == 0) {
                return "#0f0";
            } else if (d[1] > gdpDataset[i - 1][1]) {
                return "#0f0";
            } else if (d[1] < gdpDataset[i - 1][1]) {
                return "#f00";
            } else {
                return "#000";
            }
        })

        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .on("mouseover", (d) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
                .html(`${d[1]} Billion`)
                .attr("data-date", d[0])
                .style("color", "red");
        })
        .on("mouseout", (d, i) => {
            tooltip.transition().duration(200).style("opacity", 0);
        })
        .append("title")
        .text((d) => `${d[1]} Billion \n ${d[0]}`);
};
let loadGraph2 = (doping) => {
    let tooltip = d3.select("#tooltip2")
    let svg = d3
        .select("#spsvg")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    let xScale = d3
        .scaleLinear()
        .domain([
            d3.min(doping, (d) => d["Year"] - 1),
            d3.max(doping, (d) => d["Year"] + 1)
        ])
        .range([30, svgWidth - 30 - 15]);
    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${30}, ${svgHeight - 30})`)
        .call(xAxis);
    let yScale = d3
        .scaleTime()
        .domain([
            d3.min(doping, (item) => {
                return new Date(0, 0, 0, 0, 0, item['Seconds'])
            }), d3.max(doping, (item) => {
                return new Date(0, 0, 0, 0, 0, item['Seconds'])
            })])
        .range([svgHeight - 30, 30]);
    let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
    svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${2 * 30},0)`)
        .call(yAxis);
    svg
        .selectAll("circle")
        .data(doping)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr('r', '5')
        .attr('data-xvalue', (item) => { return item['Year'] })
        .attr('data-yvalue', (item) => {
            const time = item.Time.split(":");
            return new Date(1970, 0, 1, 0, time[0], time[1]);
        })
        .attr('cx', (item) => { return xScale(item['Year']) + 30 })
        .attr('cy', (item) => { return yScale(new Date(0, 0, 0, 0, 0, item['Seconds'])) })
        .attr('fill', (item) => {
            if (item['Doping'] != '') {
                return 'firebrick'
            } else {
                return 'green'
            }
        })

        .on("mouseover", (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
                .style('left', d3.event.pageX + 15 + 'px')
                .style('top', d3.event.pageY - 50 + 'px');
            let tooltipContent = `
            <span class="tooltip-label">Name</span>: ${item['Name']}
            <br> 
            <span class="tooltip-label">Nationality</span>: ${item['Nationality']}
            <br>
            <span class="tooltip-label">Year</span>: ${item['Year']}
            <br>
            <span class="tooltip-label">Place</span>: ${item['Place']}
            <br>
            <span class="tooltip-label">Time</span>: ${item['Time']}
            <br>
            ${item['Doping'] !== '' ? item['Doping'] : 'No Doping Allegations'}
        `;
            tooltip.html(tooltipContent);
            const labels = document.querySelectorAll('.tooltip-label');
            labels.forEach(label => {
                label.style.fontWeight = '600';
                label.style.textDecoration = 'underline';
            });

            tooltip.attr('data-year', item['Year']);

        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        });
    svg.append("text")
        .attr("id", "legend")
        .attr("x", svgWidth - 250)
        .attr("y", svgHeight - 100)
        .text("🟢 No doping allegations")
    svg.append('text')
        .attr("x", svgWidth - 250)
        .attr("y", svgHeight - 70)
        .text('🔴 Riders with doping allegations');
};
let loadGraph3 = (data) => {
    console.log("3");
    let tooltip = d3.select("#tooltip3")
    let svg = d3.select("#hmsvg")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    let minyear = d3.min(data.monthlyVariance, (d) => d["year"]); console.log(minyear);
    let maxyear = d3.max(data.monthlyVariance, (d) => d['year']); console.log(maxyear);

    let xScale = d3.scaleLinear()
        .domain([minyear, maxyear])
        .range([padding, svgWidth - padding]);
    let yScale = d3.scaleTime()
        .domain([new Date(0, 0, 0, 0, 0, 0), d3.max(data.monthlyVariance, (item) => { return new Date(0, item["month"], 0, 0, 0, 0) })])
        .range([padding, svgHeight - padding]);

    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${0}, ${svgHeight - padding + 2})`)
        .call(xAxis);
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding - 1},0)`)
        .call(yAxis);

    let basetemp = data['baseTemperature'];
    svg.selectAll('rect')
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr('data-month', (item) => { return item['month'] - 1 })
        .attr('data-year', (item) => { return item['year'] })
        .attr('data-temp', (item) => { return basetemp + item['variance'] })
        .attr('x', (item) => { return xScale(item['year']) })
        .attr('y', (item) => { return yScale(new Date(0, item['month'] - 1, 0, 0, 0, 0)) })
        .attr('height', `${(svgHeight - padding * 2) / 11}`)
        .attr('width', `${(svgWidth - (2 * padding)) / (maxyear - minyear)}`)
        .attr('fill', (item) => {
            if (item['variance'] + basetemp <= 3.9) { return colors[0] }
            if (item['variance'] + basetemp <= 5.0) { return colors[1] }
            if (item['variance'] + basetemp <= 6.1) { return colors[2] }
            if (item['variance'] + basetemp <= 7.2) { return colors[3] }
            if (item['variance'] + basetemp <= 8.3) { return colors[4] }
            if (item['variance'] + basetemp <= 9.5) { return colors[5] }
            if (item['variance'] + basetemp <= 10.6) { return colors[6] }
            if (item['variance'] + basetemp <= 11.7) { return colors[7] }
            if (item['variance'] + basetemp <= 12.8) { return colors[8] }
            else { return colors[9] }
        })
        .on("mouseover", (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
                .style('left', d3.event.pageX + 15 + 'px')
                .style('top', d3.event.pageY + 0 + 'px');
            let month = [0, 'jan', 'feb', 'march', 'april', 'may', 'june', 'july', 'august', 'sept', 'oct', 'nov', 'december']
            let tooltipContent = `
               <span class="tooltip-label">${month[item['month']]}</span>
               <span class="tooltip-label">${item['year']}</span> 
               <br>
               <span class="tooltip-label">${(item['variance'] + basetemp).toFixed(1)}</span>
               <br>
               <span class="tooltip-label"> ${item['variance']}</span>`;

            tooltip.html(tooltipContent);
            tooltip.attr('data-year', `${item['year']}`)
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        });
};
let loadGraph4 = (Mdata) => {
    let svg = d3.select('#tmsvg')
        .append("svg")
        .attr("id", "svg")
        .attr("width", 1000)
        .attr("height", 600);
    let tooltip = d3.select('#tooltip4')
    let hierarchy = d3.hierarchy(Mdata, (n) => {
        return n['children']
    }).sum((n) => {
        return n['value']
    }).sort((n1, n2) => {
        return n2['value'] - n1['value']
    })

    let createTreeMap = d3.treemap().size([1000, 600])
    createTreeMap(hierarchy)
    let tiles = hierarchy.leaves()
    let block = svg.selectAll('g')
        .data(tiles)
        .enter()
        .append('g')
        .attr('transform', (m) => {
            return 'translate(' + m['x0'] + ', ' + m['y0'] + ')'
        })

    block.append('rect')
        .attr('class', 'tile')
        .attr('fill', (m) => {
            let category = m['data']['category']
            if (category === 'Action') {
                return 'red'
            } else if (category === 'Drama') {
                return 'green'
            } else if (category === 'Adventure') {
                return 'blue'
            } else if (category === 'Family') {
                return 'magenta'
            } else if (category === 'Animation') {
                return 'yellow'
            } else if (category === 'Comedy') {
                return 'cyan'
            } else if (category === 'Biography') {
                return 'grey'
            }
        }).attr('data-name', (m) => {
            return m['data']['name']
        }).attr('data-category', (m) => {
            return m['data']['category']
        })
        .attr('data-value', (m) => {
            return m['data']['value']
        })
        .attr('width', (m) => {
            return m['x1'] - m['x0']
        })
        .attr('height', (m) => {
            return m['y1'] - m['y0']
        })
        .on('mouseover', (m) => {
            tooltip.transition().style('visibility', 'visible')
            let revenue = m['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            tooltip.html('$ ' + revenue + '<hr />' + m['data']['name'])
            tooltip.attr('data-value', m['data']['value'])
        })
        .on('mouseout', (m) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })

    block.append('text')
        .text((movie) => {
            return movie['data']['name']
        })
        .attr('x', 5)
        .attr('y', 20)



    let legendSVG = d3.select('#container')
        .append('svg')
        .attr('id', 'legend');
    let legendData = [
        { label: 'Action', color: 'red', y: 0 },
        { label: 'Drama', color: 'green', y: 40 },
        { label: 'Adventure', color: 'blue', y: 80 },
        { label: 'Family', color: 'magenta', y: 120 },
        { label: 'Animation', color: 'yellow', y: 160 },
        { label: 'Comedy', color: 'cyan', y: 200 },
        { label: 'Biography', color: 'grey', y: 240 }
    ];
    let legendItems = legendSVG.selectAll('g')
        .data(legendData)
        .enter()
        .append('g');
    legendItems.append('rect')
        .attr('class', 'legend-item')
        .attr('x', 10)
        .attr('y', d => d.y)
        .attr('width', 40)
        .attr('height', 40)
        .attr('fill', d => d.color);

    legendItems.append('text')
        .attr('x', 60)
        .attr('y', d => d.y + 20)
        .attr('fill', 'black')
        .text(d => d.label);

}
let loadGraph5 = (cData, eData) => {
    let svg = d3.select("#csvg")
        .append('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    function transform(scaleFactor, width, height, translateX, translateY) {
        return d3.geoTransform({
            point: function (x, y) {
                // Apply scaling and translation
                const scaledX = (x - width / 2) * scaleFactor + width / 2 + translateX;
                const scaledY = (y - height / 2) * scaleFactor + height / 2 + translateY;
                this.stream.point(scaledX, scaledY);
            }
        });
    }
    var scaleFactor = 0.5;
    var translateX = -100; // Replace with your desired translation in x
    var translateY = -70;  // Replace with your desired translation in y

    var path = d3.geoPath().projection(transform(scaleFactor, svgWidth, svgHeight, translateX, translateY));

    svg.selectAll('path')
        .data(cData)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {
            let id = countyDataItem['id']
            let county = eData.find((item) => {
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            if (percentage <= 15) {
                return "Red"
            } else if (percentage <= 30) {
                return '#FF4500'
            } else if (percentage <= 40) {
                return 'Orange'
            } else if (percentage <= 50) {
                return 'Yellow'
            } else {
                return "#32CD32"
            }
        })
        .attr('data-fips', (countyDataItem) => {
            return countyDataItem['id']
        })
        .attr('data-education', (countyDataItem) => {
            let id = countyDataItem['id'];
            let county = eData.find((item) => {
                return item['fips'] === id;
            });
            let percentage = county['bachelorsOrHigher'];
            return percentage;
        })
}
//codefilling
const barchartcode = `var svgWidth = 1000;
var svgHeight = 500;

document.addEventListener("DOMContentLoaded", () => {
  GetData();
});

let GetData = () => {
  const ajaxRequest = new XMLHttpRequest();
  ajaxRequest.open(
    "GET",
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
    true
  );
  ajaxRequest.send();
  ajaxRequest.onload = () => {
    let responseDataset = JSON.parse(ajaxRequest.responseText).data;
    loadGraph(responseDataset);
  };
};

let loadGraph = (gdpDataset) => {
  let xScale = d3
    .scaleTime()
    .domain([
      d3.min(gdpDataset, (d) => new Date(d[0])),
      d3.max(gdpDataset, (d) => new Date(d[0]))
    ])
    .range([30, svgWidth - 30 - 10]);
  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdpDataset, (d) => d[1])])
    .range([svgHeight - 30, 30]);

  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);
  let tooltip = d3.select("body").append("div").attr("id", "tooltip");
  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", \`translate(\${30}, \${svgHeight - 30})\`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", \`translate(\${2 * 30},0)\`)
    .call(yAxis);

  svg
    .selectAll("rect")
    .data(gdpDataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => 30 + xScale(new Date(d[0])))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", svgWidth / gdpDataset.length)
    .attr("height", (d, i) => svgHeight - 30 - yScale(d[1]))
    .attr("fill", (d, i) => {
      if (i == 0) {
        return "#0f0";
      } else if (d[1] > gdpDataset[i - 1][1]) {
        return "#0f0";
      } else if (d[1] < gdpDataset[i - 1][1]) {
        return "#f00";
      } else {
        return "#000";
      }
    })

    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(\`\${d[1]} Billion\`)
        .attr("data-date", d[0])
        .style("color", "red");
    })
    .on("mouseout", (d, i) => {
      tooltip.transition().duration(200).style("opacity", 0);
    })
    .append("title")
    .text((d) => \`\${d[1]} Billion \\n \${d[0]}\`);
};`,scatterplotcode=`var svgWidth = 1000;
var svgHeight = 500;

document.addEventListener("DOMContentLoaded", () => {
  GetData();
});

let GetData = () => {
  const ajaxRequest = new XMLHttpRequest();
  ajaxRequest.open(
    "GET",
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
    true
  );
  ajaxRequest.send();
  ajaxRequest.onload = () => {
    let responseDataset = JSON.parse(ajaxRequest.responseText);
    loadGraph(responseDataset);
  };
};

let loadGraph = (doping) => {
  let tooltip = d3.select("#tooltip")
  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  let xScale = d3
    .scaleLinear()
    .domain([
      d3.min(doping, (d) => d["Year"] - 1),
      d3.max(doping, (d) => d["Year"] + 1)
    ])
    .range([30, svgWidth - 30 - 15]);
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", \`translate(\${30}, \${svgHeight - 30})\`)
    .call(xAxis);
  let yScale = d3
    .scaleTime()
    .domain([
      d3.min(doping, (item) => {
        return new Date(0,0,0,0,0,item['Seconds'])
      }), d3.max(doping, (item) => {
        return new Date(0,0,0,0,0,item['Seconds'])
      })])
    .range([svgHeight - 30, 30]);
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", \`translate(\${2 * 30},0)\`)
    .call(yAxis);
  svg
    .selectAll("circle")
    .data(doping)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr('r', '5')
    .attr('data-xvalue', (item) => {return item['Year']})
    .attr('data-yvalue', (item) => {
      const time = item.Time.split(":");
      return new Date(1970, 0, 1, 0, time[0], time[1]);})
    .attr('cx', (item) => {return xScale(item['Year'])+30})
    .attr('cy', (item) => {return yScale(new Date(0,0,0,0,0,item['Seconds']))})
    .attr('fill', (item) => {
      if (item['Doping'] != '') {
        return 'firebrick'
      } else {
        return 'green'
      }
    })

    .on("mouseover", (item) => {
      tooltip.transition()
        .style('visibility', 'visible')
        .style('left', d3.event.pageX + 15 + 'px')
        .style('top', d3.event.pageY - 50 + 'px');
      let tooltipContent = \`
            \< span class="tooltip-label">Name\< /span>: \${item['Name']}
            \< br \> 
            \< span class="tooltip-label">Nationality\< /span>: \${item['Nationality']}
            \< br>
            \< span class="tooltip-label">Year\</ span>: \${item['Year']}
            \< br>
            \< span class="tooltip-label">Place\</ span>: \${item['Place']}
            \< br>
            \< span class="tooltip-label">Time\</ span>: \${item['Time']}
            \< br>
            \${item['Doping'] !== '' ? item['Doping'] : 'No Doping Allegations'}
        \`;

      tooltip.html(tooltipContent);

      const labels = document.querySelectorAll('.tooltip-label');
      labels.forEach(label => {
        label.style.fontWeight = '600';
        label.style.textDecoration = 'underline';
      });
      tooltip.attr('data-year', item['Year']);
    })

    .on('mouseout', (item) => {
      tooltip.transition()
        .style('visibility', 'hidden')
    });
    svg.append("text")
    .attr("id", "legend")
    .attr("x", svgWidth-250) 
    .attr("y", svgHeight-100) 
    .text("🟢 No doping allegations")
    svg.append('text')
    .attr("x",  svgWidth-250) 
    .attr("y",svgHeight-70) 
    .text('🔴 Riders with doping allegations'); 
};`,heatmapcode=`let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let req = new XMLHttpRequest();
const colors = [
  'rgb(0, 0, 180)',   // <= 3.9
  'rgb(69, 117, 180)',   // <= 5.0
  'rgb(116, 173, 209)',  // <= 6.1
  'rgb(171, 217, 233)',  // <= 7.2
  'rgb(224, 243, 248)',  // <= 8.3
  'rgb(255, 255, 191)',  // <= 9.5
  'rgb(254, 224, 144)',  // <= 10.6
  'rgb(253, 174, 97)',   // <= 11.7
  'rgb(244, 109, 67)',   // <= 12.8
  'rgb(215, 48, 39)'     // Else condition
];


var padding = 60;
var Width = 1000;
var Height = 450;

document.addEventListener("DOMContentLoaded", () => {
  request();
});

let request = () => {
  req.open("GET", url, true);
  req.send();
  req.onload = () => {
    let d = JSON.parse(req.responseText);
    loadGraph(d);
  }
}
let loadGraph = (data) => {
  console.log(data)
  let tooltip = d3.select("#tooltip")
  let svg = d3.select(".box")
    .append("svg")
    .attr("width", Width)
    .attr("height", Height);

  let minyear = d3.min(data.monthlyVariance, (d) => d["year"]); console.log(minyear);
  let maxyear = d3.max(data.monthlyVariance, (d) => d['year']); console.log(maxyear);

  let xScale = d3.scaleLinear()
    .domain([minyear, maxyear])
    .range([padding, Width - padding]);
  let yScale = d3.scaleTime()
    .domain([
      new Date(0, 0, 0, 0, 0, 0), 
      d3.max(data.monthlyVariance, (item) => 
        { 
          return new Date(0, item["month"], 0, 0, 0, 0) 
        })
    ])
    .range([padding, Height - padding]);

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", \`translate(\${ 0}, \${ Height - padding + 2})\`)
    .call(xAxis);
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", \`translate(\${ padding - 1}, 0)\`)
    .call(yAxis);

  let basetemp = data['baseTemperature'];
  svg.selectAll('rect')
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr('data-month', (item) => { return item['month'] - 1 })
    .attr('data-year', (item) => { return item['year'] })
    .attr('data-temp', (item) => { return basetemp + item['variance'] })
    .attr('x', (item) => { return xScale(item['year']) })
    .attr('y', (item) => { return yScale(new Date(0, item['month'] - 1, 0, 0, 0, 0)) })
    .attr('height', \`\${ (Height - padding * 2) / 11 } \`)
    .attr('width', \`\${ (Width - (2 * padding)) / (maxyear - minyear) } \`)
    .attr('fill', (item) => {
      if (item['variance'] + basetemp <= 3.9) { return colors[0] }
      if (item['variance'] + basetemp <= 5.0) { return colors[1] }
      if (item['variance'] + basetemp <= 6.1) { return colors[2] }
      if (item['variance'] + basetemp <= 7.2) { return colors[3] }
      if (item['variance'] + basetemp <= 8.3) { return colors[4] }
      if (item['variance'] + basetemp <= 9.5) { return colors[5] }
      if (item['variance'] + basetemp <= 10.6) { return colors[6] }
      if (item['variance'] + basetemp <= 11.7) { return colors[7] }
      if (item['variance'] + basetemp <= 12.8) { return colors[8] }
      else { return colors[9] }
    })
    .on("mouseover", (item) => {
      tooltip.transition()
        .style('visibility', 'visible')
        .style('left', d3.event.pageX + 15 + 'px')
        .style('top', d3.event.pageY + 0 + 'px');
      let month = [ 0, 
                    'jan'   , 'feb'   , 'march', 
                    'april' , 'may'   , 'june', 
                    'july'  , 'august', 'sept', 
                    'oct'   , 'nov'   , 'december']
      let tooltipContent = \`
    \< span class="tooltip-label" > \${ month[item['month']] }\< /span >
    \< span class="tooltip-label">\${item['year']}\</ span> 
    \< br>
    \< span class="tooltip-label">\${(item['variance'] + basetemp).toFixed(1)}\< /span>
    \< br>
    \< span class="tooltip-label"> \${item['variance']}\</ span>\`;

      tooltip.html(tooltipContent);
      tooltip.attr('data-year',\`\${item['year']}\`)
    })
    .on('mouseout', (item) => {
      tooltip.transition()
        .style('visibility', 'hidden')
    });
};`,treemapcode=`let url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
let Mdata;
let svg = d3.select('#container').append("svg").attr("id","svg");
let tooltip = d3.select('#tooltip')
let drawTreeMap = () => {
    let hierarchy = d3.hierarchy(Mdata, (n) => {
        return n['children']
    }).sum((n) => {
        return n['value']
    }).sort((n1, n2) => {
        return n2['value'] - n1['value']
    })
    let createTreeMap = d3.treemap().size([1000, 600])
    createTreeMap(hierarchy)
    let tiles = hierarchy.leaves()
    let block = svg.selectAll('g')
            .data(tiles)
            .enter()
            .append('g')
            .attr('transform', (m) => {
                return 'translate(' + m['x0'] + ', ' + m['y0'] + ')'
            })
    block.append('rect')
            .attr('class', 'tile')
            .attr('fill', (m) => {
                let category = m['data']['category']
                if(category === 'Action'){
                    return 'red'
                }else if(category === 'Drama'){
                    return 'green'
                }else if(category === 'Adventure'){
                    return 'blue'
                }else if(category === 'Family'){
                    return 'magenta'
                }else if(category === 'Animation'){
                    return 'yellow'
                }else if(category === 'Comedy'){
                    return 'cyan'
                }else if(category === 'Biography'){
                    return 'grey'
                }
            }).attr('data-name', (m) => {
                return m['data']['name']
            }).attr('data-category', (m) => {
                return m['data']['category']
            })
            .attr('data-value', (m) => {
                return m['data']['value']
            })
            .attr('width', (m) => {
                return m['x1'] - m['x0']
            })
            .attr('height', (m) => {
                return m['y1'] - m['y0']
            })
            .on('mouseover', (m) => {
                tooltip.transition().style('visibility', 'visible')
                let revenue = m['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                tooltip.html('$ ' + revenue + '/< hr />' + m['data']['name'])
                tooltip.attr('data-value', m['data']['value'])
            })
            .on('mouseout', (m) => {
                tooltip.transition()
                        .style('visibility', 'hidden')
            })
    block.append('text')
            .text((movie) => {
                return movie['data']['name']
            })
            .attr('x', 5)
            .attr('y', 20)
let legendSVG = d3.select('#container') 
    .append('svg')
    .attr('id', 'legend');
let legendData = [
    { label: 'Action', color: 'red', y: 0 },
    { label: 'Drama', color: 'green', y: 40 },
    { label: 'Adventure', color: 'blue', y: 80 },
    { label: 'Family', color: 'magenta', y: 120 },
    { label: 'Animation', color: 'yellow', y: 160 },
    { label: 'Comedy', color: 'cyan', y: 200 },
    { label: 'Biography', color: 'grey', y: 240 }
];
let legendItems = legendSVG.selectAll('g')
    .data(legendData)
    .enter()
    .append('g');
legendItems.append('rect')
    .attr('class', 'legend-item')
    .attr('x', 10)
    .attr('y', d => d.y)
    .attr('width', 40)
    .attr('height', 40)
    .attr('fill', d => d.color);
legendItems.append('text')
    .attr('x', 60)
    .attr('y', d => d.y + 20)
    .attr('fill', 'black')
    .text(d => d.label);
}
d3.json(url).then(
    (data, error) => {
        if(error){
            console.log(error)
        } else {
            Mdata = data
            drawTreeMap()
        }
    }
)`,choroplethcode=`let svg = d3.select("#csvg")
.append('svg')
.attr("width", svgWidth)
.attr("height", svgHeight);
function transform(scaleFactor, width, height, translateX, translateY) {
return d3.geoTransform({
point: function (x, y) {
// Apply scaling and translation
const scaledX = (x - width / 2) * scaleFactor + width / 2 + translateX;
const scaledY = (y - height / 2) * scaleFactor + height / 2 + translateY;
this.stream.point(scaledX, scaledY);
}
});
}
var scaleFactor = 0.5;
var translateX = -100; // Replace with your desired translation in x
var translateY = -70;  // Replace with your desired translation in y

var path = d3.geoPath().projection(transform(scaleFactor, svgWidth, svgHeight, translateX, translateY));

svg.selectAll('path')
.data(cData)
.enter()
.append('path')
.attr('d', path)
.attr('class', 'county')
.attr('fill', (countyDataItem) => {
  let id = countyDataItem['id']
  let county = eData.find((item) => {
    return item['fips'] === id
  })
  let percentage = county['bachelorsOrHigher']
  if (percentage <= 15) {
    return "Red"
  } else if (percentage <= 30) {
    return '#FF4500'
  } else if (percentage <= 40) {
    return 'Orange'
  } else if (percentage <= 50) {
    return 'Yellow'
  } else {
    return "#32CD32"
  }
})
.attr('data-fips', (countyDataItem) => {
  return countyDataItem['id']
})
.attr('data-education', (countyDataItem) => {
  let id = countyDataItem['id'];
  let county = eData.find((item) => {
    return item['fips'] === id;
  });
  let percentage = county['bachelorsOrHigher'];
  return percentage;
})}`;
// Codes filling
document.getElementById("barchartcode").innerHTML = barchartcode;
document.getElementById("scatterplotcode").innerHTML = scatterplotcode;
document.getElementById("heatmapcode").innerHTML = heatmapcode;
document.getElementById("treemapcode").innerHTML = treemapcode;
document.getElementById("choroplethcode").innerHTML = choroplethcode;