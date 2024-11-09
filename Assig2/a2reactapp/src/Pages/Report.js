import logo from '../Images/sapolice.png';
import '../App.css';
import React, { useEffect, useState } from 'react';
import SHA256 from 'crypto-js/sha256';
import Suburbs from '../Components/Suburbs'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

function App() {
    const isSignedIn = Cookies.get("isSignedIn");
    const navigate = useNavigate();

    const { firstLoc, secondLoc, camera } = useParams();
    console.log(`\n\n\n One: ${firstLoc}\t Two: ${secondLoc}\t camera: ${camera}`)

    const offenceSearch = "km/h"
    const [offenceSearchQuery, setOffenceSearchQuery] = useState('');

    const [firstLocationData, setFirstLocation] = useState([]);
    const [secondLocationData, setSecondLocation] = useState([]);
    //#region sign in and startup stuff
    useEffect(() => {
        if (!isSignedIn) {
            navigate("/login");
        } else {
            document.getElementById('name').innerHTML = "Hello " + Cookies.get('Name');
            let offenceQuerys = ''
            if (offenceSearch && offenceSearch !== "All") {
                console.log("\nSpecific\n")
                fetch(`http://localhost:5147/api/Get_SearchOffencesByDescription?searchTerm=${offenceSearch}`)
                    .then(response => response.json())
                    .then(data => {
                        let offenceQuery = "";

                        data.forEach(offence => offenceQuery += `&offenceCodes=${offence.offenceCode}`)

                        setOffenceSearchQuery(offenceQuery)
                    });
            } else if (offenceSearch && offenceSearch === "All") {
                setOffenceSearchQuery('');
                console.log("All\n")
            }
        }
    }, [isSignedIn, offenceSearch, navigate])
    //#endregion

    //#region get data
    useEffect(() => {
        console.log(offenceSearchQuery)
        //#region first graph
        fetch(`http://localhost:5147/api/Get_ExpiationsForLocationId?locationId=${firstLoc}&cameraTypeCode=${camera}&endTime=2147483647${offenceSearchQuery}`)
            .then(response => response.json())
            .then(JsonFirstGraph => {
                let expiationsByMonthFirstGraph = [];
                JsonFirstGraph.forEach(ex => {
                    let monthEx = new Date(ex.issueDate).toLocaleString('default', { month: 'long' });
                    let found = false;
                    if (expiationsByMonthFirstGraph === null) {
                        expiationsByMonthFirstGraph.push({
                            monthName: monthEx,
                            expiations: 1
                        })
                    } else {
                        expiationsByMonthFirstGraph.forEach(month => {
                            if (month.monthName === monthEx) {
                                month.expiations += 1;
                                found = true
                            }
                        });
                        if (found === false) {
                            expiationsByMonthFirstGraph.push({
                                monthName: monthEx,
                                expiations: 1
                            })
                        }
                    }
                })
                //https://dev.to/nasreenkhalid/how-to-sort-an-array-of-month-names-javascript-4c3n
                // making sure its in the right order
                expiationsByMonthFirstGraph.sort((a, b) => {
                    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    return monthOrder.indexOf(a.monthName) - monthOrder.indexOf(b.monthName)
                })

                BuildFirstGraph(expiationsByMonthFirstGraph, firstLoc)
            })
            //#endregion
            //#region second graph
            fetch(`http://localhost:5147/api/Get_ExpiationsForLocationId?locationId=${secondLoc}&cameraTypeCode=${camera}&endTime=2147483647${offenceSearchQuery}`)
                .then(response => response.json())
                .then(JsonSecondGraph => {
                    let expiationsByMonthSecondGraph = [];
                    JsonSecondGraph.forEach(ex => {
                        let monthEx = new Date(ex.issueDate).toLocaleString('default', { month: 'long' });
                        let found = false;
                        if (expiationsByMonthSecondGraph === null) {
                            expiationsByMonthSecondGraph.push({
                                monthName: monthEx,
                                expiations: 1
                            })
                        } else {
                            expiationsByMonthSecondGraph.forEach(month => {
                                if (month.monthName === monthEx) {
                                    month.expiations += 1;
                                    found = true
                                }
                            });
                            if (found === false) {
                                expiationsByMonthSecondGraph.push({
                                    monthName: monthEx,
                                    expiations: 1
                                })
                            }
                        }
                    })
                    //https://dev.to/nasreenkhalid/how-to-sort-an-array-of-month-names-javascript-4c3n
                    // making sure its in the right order
                    expiationsByMonthSecondGraph.sort((a, b) => {
                        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        return monthOrder.indexOf(a.monthName) - monthOrder.indexOf(b.monthName)
                    })

                    BuildSecondGraph(expiationsByMonthSecondGraph, secondLoc)
                })
            

            //#endregion
    }, [offenceSearchQuery, camera, firstLoc, secondLoc])

    //#endregion
    function SignOut() {
        Cookies.remove('isSignedIn');
        Cookies.remove('Name');
        window.location.reload();
    }

    function BuildFirstGraph(dataSet, titleText) {
        //#region svg setup

        const svg = d3.select('#graph1');

        let w = svg.node().getBoundingClientRect().width;
        let h = svg.node().getBoundingClientRect().height;

        const chartMargins = {
            left: 50,
            right: 25,
            top: 25,
            bottom: 80

        }
        h -= (chartMargins.top + chartMargins.bottom);
        w -= (chartMargins.left + chartMargins.right);
        d3.select('#graph1').selectAll('*').remove();
        //#endregion
        
        //#region labels

        svg.append('text')
            .attr('x', w / 2 + chartMargins.left)
            .attr('y', h + chartMargins.top + chartMargins.bottom - 30)
            .attr('text-anchor', 'middle')
            .style('font-size', '1.2em')
            .text('Months');

        svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('x', -h / 2 - chartMargins.top)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '1.2em')
            .text('Expiations');

        svg.append('text')
            .attr('x', w / 2 + chartMargins.left)  // Center the title
            .attr('y', chartMargins.top / 2)  // Position above the chart
            .attr('text-anchor', 'middle')
            .style('font-size', '1.2em')
            .style('font-weight', 'bold')
            .text(`Location ${titleText}`);
            //#endregion
        DisplayGraph(dataSet, svg, w, h, chartMargins);
    }


    function BuildSecondGraph(dataSet, titleText) {
        //#region svg setup

        const svg = d3.select('#graph2');

        let w = svg.node().getBoundingClientRect().width;
        let h = svg.node().getBoundingClientRect().height;

        const chartMargins = {
            left: 50,
            right: 25,
            top: 30,
            bottom: 80

        }
        h -= (chartMargins.top + chartMargins.bottom);
        w -= (chartMargins.left + chartMargins.right);
        d3.select('#graph2').selectAll('*').remove();
        //#endregion
        //#region labels
        svg.append('text')
            .attr('x', w / 2 + chartMargins.left)
            .attr('y', h + chartMargins.top + chartMargins.bottom - 30)
            .attr('text-anchor', 'middle')
            .style('font-size', '1.2em')
            .text('Months');

        svg.append('text')
            .attr('transform', `rotate(-90)`)
            .attr('x', -h / 2 - chartMargins.top)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '1.2em')
            .text('Expiations');

        svg.append('text')
            .attr('x', w / 2 + chartMargins.left)  // Center the title
            .attr('y', chartMargins.top / 2)  // Position above the chart
            .attr('text-anchor', 'middle')
            .style('font-size', '1.2em')
            .style('font-weight', 'bold')
            .text(`Location ${titleText}`);
            //#endregion
        
        DisplayGraph(dataSet, svg, w, h, chartMargins);
    }

    function DisplayGraph(dataSet, svg, w, h, chartMargins, titleText) {
        //#region SVG stuff
        console.log(dataSet);
        let monthArray = Array.from(dataSet, (d, i) => d.monthName);

        console.log("array: " + monthArray);

        let totalItemsRange = d3.extent(dataSet, (d, i) => d.expiations);
        let maxTotalItems = totalItemsRange[1];

        const barMargin = 10;
        const barWidth = w / dataSet.length;

        let yScale = d3.scaleLinear()
            .domain([0, maxTotalItems])
            .range([h, 0]);

        let xScale = d3.scaleBand()
            .domain(monthArray)
            .range([0, w])
            .paddingInner(0.1);

        const chartGroup = svg.append('g')
            .classed('chartGroup', true)
            .attr('transform', `translate(${chartMargins.left},${chartMargins.top})`);

        let barGroups = chartGroup
            .selectAll('g')
            .data(dataSet);

        let newBarGroups = barGroups.enter()
            .append('g')
            .attr('transform', (d, i) => {
                return `translate(${xScale(d.monthName)}, ${yScale(d.expiations)})`;
            });

        newBarGroups
            .append('rect')
            .attr('x', 0)
            .attr('height', 0)
            .attr('y', (d, i) => { return h - yScale(d.expiations); })
            .attr('width', xScale.bandwidth())
            .style('fill', 'transparent')
            .transition().duration((d, i) => i * 300)
            .delay((d, i) => i + 200)
            .attr('y', 0)
            .attr('height', (d, i) => { return h - yScale(d.expiations); })
            .style('fill', (d, i) => { return `rgb(23,${i * 20 + 10},${i * 20 + 91})` });
        newBarGroups
            .append('text')
            .attr("text-anchor", "middle")
            .attr('x', (d, i) => { return xScale.bandwidth() / 2; })
            .attr('y', 16)
            .attr('fill', 'white')
            .style('font-size', '1em')
            .text((d, i) => d.expiations.toLocaleString());

        //11 create y Axis and save to svg
        let yAxis = d3.axisLeft(yScale);
        chartGroup.append('g')
            .classed('axis y', true)
            .call(yAxis);

        let xAxis = d3.axisBottom(xScale);
        chartGroup.append('g')
            .attr('transform', `translate(10, ${h})`)
            .classed('axis x', true)
            .call(xAxis);

        // labels
        //#endregion
    }

    return (
        <div className="container-fluid ">
            <p>
             Report Page
                118
                51 
            </p>
            <div className="row">
                <div class="col-lg-6">
                    <div class="card text-white bg-secondary">
                        <svg id="graph1" width="100%" height="600px" className="border border-primary rounded p-2"> </svg>
                        <div class="card-body">
                            <h5 class="card-title">Special title treatment</h5>
                            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card text-white bg-secondary ">
                        <svg id="graph2" width="100%" height="600px" className="border border-primary rounded p-2"> </svg>
                        <div class="card-body">
                            <h5 class="card-title">Special title treatment</h5>
                            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>
    );
}

export default App;
