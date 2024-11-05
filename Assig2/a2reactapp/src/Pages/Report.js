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

    useEffect(() => {
        if (!isSignedIn) {
            navigate("/login");
        } else {
            document.getElementById('name').innerHTML = "Hello " + Cookies.get('Name');
            fetchData();
        }
    })
    function SignOut() {
        Cookies.remove('isSignedIn');
        Cookies.remove('Name');
        window.location.reload();
    }

    async function fetchData() {
        const offencesCall = await fetch(`http://localhost:5147/api/Get_SearchOffencesByDescription?searchTerm=${offenceSearch}`)
        const offenceData = await offencesCall.json();
        let offencesList = ""

        offenceData.forEach(offence => offencesList += `&offenceCodes=${offence.offenceCode}`)

        //#region svg query for 118
        const Data118 = await fetch(`http://localhost:5147/api/Get_ExpiationsForLocationId?locationId=${firstLoc}&cameraTypeCode=${camera}&endTime=2147483647${offencesList}`)
        const Json118 = await Data118.json();


        //
        let expiationsByMonth118 = [];

        Json118.forEach(ex => {
            let monthEx = new Date(ex.issueDate).toLocaleString('default', { month: 'long' });
            let found = false;
            if (expiationsByMonth118 === null) {
                expiationsByMonth118.push({
                    monthName: monthEx,
                    expiations: 1
                })
            } else {
                expiationsByMonth118.forEach(month => {
                    if (month.monthName === monthEx) {
                        month.expiations += 1;
                        found = true
                    }
                });
                if (found === false) {
                    expiationsByMonth118.push({
                        monthName: monthEx,
                        expiations: 1
                    })
                }
            }

        })
        //https://dev.to/nasreenkhalid/how-to-sort-an-array-of-month-names-javascript-4c3n
        // making sure its in the right order
        expiationsByMonth118.sort((a, b) => {
            const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return monthOrder.indexOf(a.monthName) - monthOrder.indexOf(b.monthName)
        })

        buildFirstGraph(expiationsByMonth118)
        
        console.log(expiationsByMonth118);
        //#endregion

    }


    function buildFirstGraph(dataSet) {
        //#region svg setup

        const svg = d3.select('svg');

        let w = svg.node().getBoundingClientRect().width;
        let h = svg.node().getBoundingClientRect().height;

        const chartMargins = {
            left: 40,
            right: 25,
            top: 25,
            bottom: 80

        }
        h -= (chartMargins.top + chartMargins.bottom);
        w -= (chartMargins.left + chartMargins.right);
        //#endregion

        //#region SVG stuff
        d3.selectAll("svg > *").remove();

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
            .style('fill', (d, i) => { return `rgb(20,20,${i * 15 + 80})` });
        newBarGroups
            .append('text')
            .attr("text-anchor", "middle")
            .attr('x', (d, i) => { return xScale.bandwidth() / 2; })
            .attr('y', 20)
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
            //#endregion

    }

    return (
        <div className="container-fluid ">
            <p>
             Report Page
                118
                65 
            </p>
            
            <svg width="50%" height="600px" className="border border-primary rounded p-2"> </svg>
        </div>
    );
}

export default App;
