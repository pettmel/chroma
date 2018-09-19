function sortSeriesbyY(a,b){
    if(a[1] < b[1])
        return -1;
    if(a[0] > b[0])
        return 1;
    return 0;
}
function sortSeriesByDate (a,b) {
  if (a[0] < b[0])
    return -1;
  if (a[0] > b[0])
    return 1;
  return 0;
}
Array.prototype.filterByYear = function(val){
    return this.filter(function(el){
        return el.x.year() == val.year*1;
    })
}
Array.prototype.filterByMonth = function(val){
    return this.filter(function(el){
        return el.x.year() == val.year*1 &&
               el.x.month() == val.month*1;
    })
}
var get_Tgts_Wrt_CurrentPt = function(arrRefPts, thisPoint, searchCriteria){
    var searchResults = []
    switch(searchCriteria.toLocaleLowerCase()){
        case "Gt MRU High".toLocaleLowerCase():{
            for(var i=0; i<arrRefPts.length; i++){
                var mruEntry = arrRefPts[i];
                if(thisPoint.y > mruEntry.highPt.y){
                    searchResults.push(mruEntry);
                }
            }
            break;
        }
        case "Eq MRU High".toLocaleLowerCase():{
            for(var i=0; i<arrRefPts.length; i++){
                var mruEntry = arrRefPts[i];
                if(thisPoint.y == mruEntry.highPt.y){
                    searchResults.push(mruEntry);
                }
            }            
            break;
        }
        case "Lt MRU High".toLocaleLowerCase():{
            for(var i=0; i<arrRefPts.length; i++){
                var mruEntry = arrRefPts[i];
                if(thisPoint.y < mruEntry.highPt.y){
                    searchResults.push(mruEntry);
                }
            }            
            break;
        }
        case "Gt MDD Low".toLocaleLowerCase():{
            for(var i=0; i<arrRefPts.length; i++){
                var mddEntry = arrRefPts[i];
                if(thisPoint.y > mddEntry.lowPt.y){
                    searchResults.push(mddEntry);
                }
            }              
            break;
        }
        case "Eq MDD Low".toLocaleLowerCase():{
            for(var i=0; i<arrRefPts.length; i++){
                var mddEntry = arrRefPts[i];
                if(thisPoint.y == mddEntry.lowPt.y){
                    searchResults.push(mddEntry);
                }
            }                  
            break;
        }
        case "Lt MDD Low".toLocaleLowerCase():{
            for(var i=0; i<arrRefPts.length; i++){
                var mddEntry = arrRefPts[i];
                if(thisPoint.y < mddEntry.lowPt.y){
                    searchResults.push(mddEntry);
                }
            }                
            break;
        }
        default:return [];
    }
    return searchResults;
}
var getWindDirection = function(lastPt, currPt){
    var lastPtVal = lastPt.y;
    var thisPtVal = currPt.y;
    var wind = ((thisPtVal-lastPtVal) >= 1)? 1:0;
    wind = ((thisPtVal-lastPtVal) < 0)? -1:wind;
    return {lastPt:lastPt,currPt:currPt,direction:wind};
}
///Returns the maximum run up on a series of data
function getMaxRunUp(ds, bUseUpCheck){
    //if(bUseUpCheck == true){console.log('calling GetMaxRunUP');}
    var iMax = ds.length, iFinal = iMax-1;
    var dirHist = []; //{pt1:{},pt2:{},direction}, (>=1:'up',0:'flat',<=0:'down')
    var mru = {highPt:0,lowPt:0,range:0}, lastPt ={}, currPt={};
    var arrMRUs = [];

    for(var i=0; i<iMax; i++){
        currPt = ds[i];
        if(i==0){
            arrMRUs.push({highPt:{x:currPt.x.clone(),y:currPt.y}, 
                         lowPt:{x:currPt.x.clone(), y:currPt.y}, range:0});
            lastPt = {x:currPt.x.clone(),y:currPt.y};
            dirHist.push(getWindDirection(lastPt,currPt));
        }
        else{
            //Get wind directions
            var currWind = getWindDirection(lastPt,currPt);
            var lWind = dirHist[i-1];
            //If wind direction changed from positive/flat to negative create a new mdd peak to track
            if(lWind.direction < currWind.direction){
                arrMRUs.push({highPt:{x:lastPt.x.clone(),y:lastPt.y}, 
                              lowPt:{x:lastPt.x.clone(),y:lastPt.y}, range:0});
            }
            var mrus_wHigh_lt_currPoint = get_Tgts_Wrt_CurrentPt(arrMRUs, currPt, "gt mru high");
            var mrus_wHigh_eq_currPoint = get_Tgts_Wrt_CurrentPt(arrMRUs, currPt, "eq mru high");
            for(var iHigh=0; iHigh<mrus_wHigh_lt_currPoint.length; iHigh++){
                var thisMru = mrus_wHigh_lt_currPoint[iHigh];
                if(currPt.y > thisMru.highPt.y){
                    thisMru.highPt.x = currPt.x.clone();
                    thisMru.highPt.y = currPt.y;
                    thisMru.range = thisMru.highPt.y - thisMru.lowPt.y;
                }
            }
            for(var iEq=0; iEq<mrus_wHigh_eq_currPoint.length; iEq++){
                var thisMru = mrus_wHigh_eq_currPoint[iEq];
                if(currPt.y == thisMru.highPt.y){
                    thisMru.highPt.x = currPt.x.clone();
                }
            }
            dirHist.push(currWind);
            lastPt = currPt;
        }
    }
    var mru_Highs = [];
    //var arrMRU_Dates = [];
    //for(var d=0; d < arrMRUs.length; d++){var mruDate = arrMRUs[d].highPt.x.format("YYYY-MM-DD"); arrMRU_Dates.push(mruDate);}
    //console.log(arrMRU_Dates);
    arrMRUs.sort(function(mru1, mru2){
        return mru2.range - mru1.range
    });
    for(var i=0; i<arrMRUs.length; i++){
        var mru = arrMRUs[i];
        if(i == 0){
            mru_Highs.push(mru);
        }
        else{
            if(mru.range == mru_Highs[0].range){
                mru_Highs.push(mru);
            }
        }
    }
    return mru_Highs;
}
///Returns the maximum draw down on a series of data
function getMaxDrawDown (dataset, bUseUpCheck){
    //console.log("calling GetMaxDrawDown");
    var iLength = dataset.length, iLast = iLength -1;
    var directionHistory = []; //{pt1:{},pt2:{},direction}, (>=1:'up',0:'flat',<=0:'down')
    var currentDirection = 0, lastDirection = 0;
    var mdd = {highPt:0,lowPt:0,range:0}, lastPoint ={}, thisPoint={};
    var arrMDDs = [];

    for(var i=0; i<iLength; i++){
        thisPoint = dataset[i];
        if(i==0){
            arrMDDs.push({highPt:{x:thisPoint.x.clone(), y:thisPoint.y}, 
                          lowPt:{x:thisPoint.x.clone(),y:thisPoint.y}, range:0});
            lastPoint = {x:thisPoint.x.clone(),y:thisPoint.y};
            directionHistory.push(getWindDirection(lastPoint,thisPoint));
        }
        else{
            //Get wind directions
            var currentWind = getWindDirection(lastPoint,thisPoint);
            var lastWind = directionHistory[i-1];
            //If wind direction changed from positive/flat to negative create a new mdd peak to track
            if(lastWind.direction > currentWind.direction){
                arrMDDs.push({highPt:{x:lastPoint.x.clone(),y:lastPoint.y}, 
                              lowPt:{x:lastPoint.x.clone(),y:lastPoint.y}, range:0});
            }
            //else{
                //If this point is <= MDD low point, then update the MDD
                var mdds_wLow_lt_currPoint = get_Tgts_Wrt_CurrentPt(arrMDDs, thisPoint, "lt mdd low");
                var mdds_wLow_eq_currPoint = get_Tgts_Wrt_CurrentPt(arrMDDs, thisPoint, "eq mdd low");
                for(var iLow=0; iLow<mdds_wLow_lt_currPoint.length; iLow++){
                    var thisMdd = mdds_wLow_lt_currPoint[iLow];
                    if(thisPoint.y < thisMdd.lowPt.y){
                        thisMdd.lowPt.x = thisPoint.x.clone();
                        thisMdd.lowPt.y = thisPoint.y;
                        thisMdd.range = thisMdd.highPt.y - thisMdd.lowPt.y;
                    }
                }
                for(var iEq=0; iEq<mdds_wLow_eq_currPoint.length; iEq++){
                    var thisMdd = mdds_wLow_eq_currPoint[iEq];
                    if(thisPoint.y == thisMdd.lowPt.y){
                        thisMdd.lowPt.x = thisPoint.x.clone();
                    }
                }
            //}
            directionHistory.push(currentWind);
            lastPoint = thisPoint;
        }
    }
    var mdd_Highs = [];
    //var arrMDD_Dates = [];
    //for(var d=0; d < arrMDDs.length; d++){var mddDate = arrMDDs[d].highPt.x.format("YYYY-MM-DD"); arrMDD_Dates.push(mddDate);}
    //console.log(arrMDD_Dates);
    arrMDDs.sort(function(mdd1, mdd2){
        return mdd2.range - mdd1.range
    });
    for(var i=0; i<arrMDDs.length; i++){
        var mdd = arrMDDs[i];
        if(i == 0){
            mdd_Highs.push(mdd);
        }
        else{
            if(mdd.range == mdd_Highs[0].range){
                mdd_Highs.push(mdd);
            }
        }
    }
    return mdd_Highs;
}
function getEquityExposureReduction(dataset, mdd){
    var dsLen = dataset.length;
    var equityHigh = 0;
    var equityLow = 0;
    var highDay = mdd.highPt.x.clone();
    var lowDay = mdd.lowPt.x.clone();
    var reduction = 0;
    for(var i=0; i< dsLen; i++){
        var eqPt = dataset[i];
        if(highDay.isSame(eqPt[0])){
            equityHigh = eqPt[1];
        }
        if(lowDay.isSame(eqPt[0])){
            equityLow = eqPt[1];
            break;
        }
    }
    if(equityHigh && equityLow){
        reduction = equityHigh - equityLow;
    }
    return reduction;
}
function getMaxDrawDownRecoveryInfo(dataset,mdd){
    var dsLen = dataset.length;
    var recoveryTgt = mdd.highPt.y;
    var recoveryDate = mdd.highPt.x.clone();
    var daysTillRecovery = 0;
    for(var i=0; i<dsLen; i++){
        var pt = dataset[i];
        recoveryDate = pt.x.clone();
        if(pt.y >= recoveryTgt && !recoveryDate.isSame(mdd.highPt.x)){
            daysTillRecovery = recoveryDate.diff(mdd.lowPt.x.clone(),'days');
            break;
        }
    }
    if(daysTillRecovery == 0){
        daysTillRecovery = "TBD";
    }
    return {'daysTillRecovery':daysTillRecovery,'recoveryDate':recoveryDate};
}
function getCompoundReturnRate(dataset){
    var crrChroma = 1, crrBench = 1, dLen = dataset.chroma.length;
    for(var i=0; i<dLen; i++){
        var dataPt_chroma = 1.000001 + dataset.chroma[i].performance;
        var dataPt_bench = 1.000001 + dataset.benchmark[i].performance;
        crrChroma = (i > 0)? crrChroma*dataPt_chroma : dataPt_chroma;
        crrBench = (i > 0)? crrBench*dataPt_bench : dataPt_bench;
    }
    crrChroma = (Math.pow(crrChroma,252/dLen) - 1)*100;
    crrBench = (Math.pow(crrBench,252/dLen) - 1)*100;
    return {chroma:crrChroma, benchmark:crrBench};
}
function getRateOfReturn (dataset){
    var ror = 0, range = 1;
    if(dataset.chroma && dataset.chroma.length){
        var iLast = dataset.chroma.length -1;
        var startYear = dataset.chroma[0].x.year();
        var endYear = dataset.chroma[iLast].x.year();
        range = endYear - startYear;
        var startValue = dataset.chroma[0].y;
        var endValue = dataset.chroma[iLast].y;
        dataset.RoR_Chroma = (endValue/startValue*100) - 100;
    }
    if(dataset.benchmark && dataset.benchmark.length){
        var startValue = dataset.benchmark[0].y;
        var endValue = dataset.benchmark[dataset.benchmark.length - 1].y;
        dataset.RoR_Benchmark = (endValue/startValue*100) - 100;
    }
    return {chroma:dataset.RoR_Chroma, benchmark:dataset.RoR_Benchmark, years:range}
}
var getDrillDownViewData = function(tolerance, investment, timeWindow){
    var drillDownView = {};
    drillDownView.chroma = getPerfData("chroma",tolerance,investment,timeWindow);
    drillDownView.benchmark = getPerfData("bench",tolerance,investment,timeWindow);
    drillDownView.bonds = getAllocData("bonds",tolerance,timeWindow);
    drillDownView.commodities = getAllocData("commodities",tolerance,timeWindow);
    drillDownView.equity = getAllocData("equity",tolerance,timeWindow);
    drillDownView.cash = getAllocData("cash",tolerance,timeWindow);
    return drillDownView;
}
var zzgetDrillDownViewData = function(target){
    var chromaData = getChromaData();
    var benchmarkData = getBenchmarkData();
    if(target.depth == 'year'){
        chromaData = chromaData.filterByYear(target);
        benchmarkData = benchmarkData.filterByYear(target);
        return {chroma:chromaData,benchmark:benchmarkData};
    }
    if(target.depth == 'month'){
        chromaData = chromaData.filterByMonth(target);
        benchmarkData = benchmarkData.filterByMonth(target);
        return {chroma:chromaData,benchmark:benchmarkData};
    }
}
var getDataPoint = function(isMode_DrillDown){
    var data = null;
   /* if(!isMode_DrillDown){
        data = chromaData.pop();
    }
    else{*/
        var chromaPoint = _drillDownViewData.chroma.pop();
        var benchmarkPoint =  _drillDownViewData.benchmark.pop();
        data = {chroma:chromaPoint,benchmark:benchmarkPoint};
    //}
    return data;
}
var getChromaDataForGoogleChart = function(){
    var cData = getChromaData();
    var result = [];
    for(var elem=0; elem < cData.length; elem++){
        var coord = cData[elem];
        result.push([new Date(coord.x.format("YYYY-MM-DD")),coord.y]);
    }
    return result;
}
var getDataForGoogleChart = function(){
    var cData = getChromaData();
    var bData = getBenchmarkData();
    var result = [];
    result.push(["Date","Chroma","Benchmark"]);
    for(var elem=0; elem < cData.length; elem++){
        var coordC = cData[elem];
        var coordB = bData[elem];
        result.push([new Date(coordC.x.format("YYYY-MM-DD")),coordC.y,coordB.y]);
    }
    return result;
}
function getSourceDataByTolerance(tolerance){
    var sourceData = [];
        switch(tolerance){
        case 'LOW':{sourceData = data_conservative;} break;
        case 'MODERATE':{sourceData = data_moderate;} break;
        case 'HIGH':{sourceData = data_aggressive;} break;        
        default:break;
    }
    return sourceData;
}
function getPerfData(target, tolerance, investment, timeWindow){
    var sourceData = getSourceDataByTolerance(tolerance);
    var result = [];
    var rowCount = sourceData.length;
    var firstEntry = true; resIndex = 0;
    for(var i=0; i<rowCount; i++){
        var src = sourceData[i];
        var performance = 0;
        switch(target){
            case 'chroma': {performance = src.chromaPerf;}break;
            case 'bench': {performance = src.benchPerf;}break;
            default:break;
        }
        if(timeWindow.Start < timeWindow.End && src.date >= timeWindow.Start && src.date <= timeWindow.End){
            var startInvest = (firstEntry)? investment : result[resIndex-1].y;
            var endInvest = startInvest + (startInvest*performance);
            var newRecord = {x:moment(src.date), y:endInvest, performance:performance};
            result.push(newRecord);
            firstEntry = false;
            resIndex++;
        }
    }
    return result;
}

function getAllocData(target, tolerance, timeWindow){
    var sourceData = getSourceDataByTolerance(tolerance);
    var result = [];
    var rowCount = sourceData.length;
    for(var i=0; i< rowCount; i++){
        var src = sourceData[i];
        var allocation = 0;
        switch(target.toLowerCase()){
            case 'bonds': {allocation = src.bonds * 100;} break;
            case 'cash': {allocation = src.cash * 100;} break;
            case 'equity': {allocation = src.equityTotal * 100;} break;
            case 'commodities': {allocation = src.commodities * 100;} break;
            default:break;
        }
        if(timeWindow.Start < timeWindow.End && src.date >= timeWindow.Start && src.date <= timeWindow.End){
            var newRecord = [src.date, allocation];
            result.push(newRecord);
        }
    }
    return result;
}
