import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  var input = [
    "KOESTNER",
    "RUESSWURM",
    "DUERMUELLER",
    "JAEAESKELAEINEN",
    "GROSSSCHAEDL",
  ];
  useEffect(() => {
    task1(input);
    task3(task2(input));
  }, []);

  let [outTask1, setOutTask1] = useState([]);
  let [outTask2, setOutTask2] = useState([]);
  let [outTask3, setOutTask3] = useState([]);

  const task1 = (input) => {
    var output = [];
    input.forEach((item) => {
      output.push(
        item
          .replaceAll("AE", "Ä")
          .replaceAll("OE", "Ö")
          .replaceAll("UE", "Ü")
          .replaceAll("SS", "ß")
      );
    });
    setOutTask1(output);
  };

  const task2 = (input) => {
    var allStrings = [];
    input.forEach((item) => {
      var subString = item;
      var sliceList = [[], []];
      var index = 0;

      //strings are divided into slices, while every slice contains one umlaut
      while (containsUmlaut(subString)) {
        index = findNextUmlaut(subString, ["AE", "OE", "UE", "SS"], 0);
        var slice = subString.slice(0, index + 2);
        var newSubString = subString.slice(index + 2, subString.length);
        if (containsUmlaut(newSubString)) {
          sliceList[0].push(slice);
          subString = newSubString;
        } else {
          sliceList[0].push(subString);
          break;
        }
      }
      allStrings.push(sliceList);
    });

    //for every slice a corresponding slice (with translated umlauts) is generated
    var result = [];
    allStrings.forEach((slices) => {
      slices[0].forEach((slice) => {
        slices[1].push(
          slice
            .replaceAll("AE", "Ä")
            .replaceAll("OE", "Ö")
            .replaceAll("UE", "Ü")
            .replaceAll("SS", "ß")
        );
      });
      //slices are concatinated in every possible combination using binary numbers
      var numberOfTotalSlices = Math.pow(2, slices[0].length) - 1;
      var words = [];
      for (var i = 0; i <= numberOfTotalSlices; i++) {
        var binaryString = dec2bin(i, slices[0].length);
        var word = "";
        for (var j = 0; j < binaryString.length; j++) {
          word = word.concat(slices[binaryString[j]][j]);
        }
        words.push(word);
      }
      result.push(words);
    });

    //Tripple S occurences are handled
    result.forEach((words) => {
      words.forEach((word) => {
        var index = 0;
        if (containsTripleS(word)) {
          var index = findNextUmlaut(word, ["ßS", "Sß"], index);
          words.push(swapStr(word, index, index + 1));
        }
      });
    });
    setOutTask2(result);
    return result;
  };

  const task3 = (input) => {
    var namesToBeFound = input;
    var sqlQueries = [];
    namesToBeFound.forEach((nameList) => {
      var query = "SELECT * FROM patient WHERE last_name IN (";
      nameList.forEach((nameVersion) => {
        query = query + "'" + nameVersion + "', ";
      });
      sqlQueries.push(query.slice(0, -2) + ");");
    });
    setOutTask3(sqlQueries);
  };

  //looks for next umlaut in a given string
  const findNextUmlaut = (string, umlauts, start) => {
    var index = string.length;
    for (var i = 0; i < umlauts.length; i++) {
      if (
        string.indexOf(umlauts[i], start) > -1 &&
        string.indexOf(umlauts[i], start) < index
      ) {
        index = string.indexOf(umlauts[i]);
      }
    }
    return index;
  };

  //checks for umlauts
  const containsUmlaut = (string) => {
    if (
      string.includes("AE") ||
      string.includes("OE") ||
      string.includes("UE") ||
      string.includes("SS")
    ) {
      return true;
    }
    return false;
  };

  //checks for triple S
  const containsTripleS = (string) => {
    if (string.includes("ßS") || string.includes("Sß")) {
      return true;
    }
    return false;
  };

  //help funtion for binary numbers
  const dec2bin = (dec, size) => {
    var result = (dec >>> 0).toString(2);
    while (result.length < size) result = "0" + result;
    return result;
  };

  //help function to swap chars
  const swapStr = (str, first, last) => {
    return (
      str.substr(0, first) +
      str[last] +
      str.substring(first + 1, last) +
      str[first] +
      str.substr(last + 1)
    );
  };

  return (
    <div className="app">
      <div className="text">
        <h1>Task 1</h1>
        {outTask1.map((string, index) => (
          <p key={index}>{string}</p>
        ))}
      </div>
      <div className="text">
        <h1>Task 2</h1>
        {outTask2.map((string, index) => {
          return <p key={index}>{string.join(", ")}</p>;
        })}
      </div>
      <div className="text">
        <h1>Task 3</h1>
        {outTask3.map((string, index) => (
          <p key={index}>{string}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
