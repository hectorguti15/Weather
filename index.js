window.addEventListener("load", function () {
  let loaderContainer = document.querySelector(".loader-container");
  loaderContainer.style.ocapacity = 0;
  loaderContainer.style.visibility = "hidden";
});

const selectMode = document.querySelector(".select-mode-dark");
selectMode.addEventListener("click", function () {
  let changeMode = document.querySelector(".dark");
  changeMode.classList.toggle("light");

  let buttonChange = document.getElementById("select-button");

  if (buttonChange.classList[0] == "select-mode-dark") {
    buttonChange.classList.remove("select-mode-dark");
    buttonChange.classList.add("select-mode-light");
  } else if (buttonChange.classList[0] == "select-mode-light") {
    buttonChange.classList.remove("select-mode-light");
    buttonChange.classList.add("select-mode-dark");
  }
});

//Get capital
fetch("capital.json")
  .then((resp) => resp.json())
  .then(function (data) {
    const values = Object.values(data);
    const keys = Object.keys(data);

    const capitals = [];

    for (const [index, key] of keys.entries()) {
      capitals.push({
        acronym: key,
        name: values[index],
      });
    }
    let input = document.getElementById("searching");
    input.addEventListener("input", function (e) {
      if (e.target.value == "") {
        let table = document.querySelector("table");
        table.style.display = "none";
      } else {
        let table = document.querySelector("table");
        table.style.display = "block";
        let value = e.target.value.toLowerCase();

        let filterArray = capitals.filter(function (element) {
          if (
            element.name.toLowerCase().includes(value) ||
            element.acronym.toLowerCase().includes(value)
          ) {
            return element;
          }
        });

        let tbody = document.getElementById("tbody");
        tbody.innerHTML = "";

        filterArray.forEach(function (data) {
          let tr = document.createElement("tr");

          tr.innerHTML = `<td class="acronym">${data.acronym}</td>
                        <td class="name">${data.name}</td>`;

          tr.classList.add("filter");
          tbody.append(tr);
        });

        window.addEventListener("click", function (e) {
          e.stopImmediatePropagation();

          let parent = e.target.parentNode;
          if (parent.classList == "filter") {
            let table = document.querySelector("table");
            table.style.display = "none";

            let acronymCountry = parent.querySelector(".acronym").textContent;
            let capitalCountry = parent.querySelector(".name").textContent;

            input.value = `${acronymCountry}, ${capitalCountry}`;

            const dataWeather = async function () {
              let weather = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${capitalCountry}&appid=50e2f438823220de6cafee42aa112f56`
              )
                .then((resp) => resp.json())
                .then(function (data) {
                  let dataIcon = data.weather[0].icon;
                  console.log(data);
                  let feelsLike = document.querySelector(".feelslikeData");
                  let humidityData = document.querySelector(".humidityData");
                  let weather_information = document.querySelector(
                    ".weather-information"
                  );
                  let temperature = document.querySelector(".temperature");

                  let feelsLikeTemperatureData = data.main.feels_like;
                  let humidityTemperatureData = data.main.humidity;
                  let temperatureData = data.main.temp;
                  let descriptionData = data.weather[0].description;

                  feelsLike.innerHTML = `<h3>${feelsLikeTemperatureData}°</h3>`;
                  humidityData.innerHTML = `<h3>${humidityTemperatureData}</h3>`;
                  weather_information.innerHTML = `<h2>${descriptionData.toUpperCase()}</h2>`;
                  temperature.innerHTML = `<h2>${temperatureData}°</h2>`;

                  fetch(`http://openweathermap.org/img/wn/${dataIcon}@2x.png`, {
                    // ...
                    referrerPolicy: "unsafe_url",
                  })
                  .then(function (data) {
                    let divImg = document.querySelector(".img-information");
                    divImg.innerHTML = `<img
                    class="upper-info-item img-information-item"
                    src="${data.url.replace("http", "https")}"
                    alt=""
                    />`;
                  });
                });
            };
            dataWeather();
            fetch(`https://countryflagsapi.com/png/${acronymCountry}`).then(
              function (data) {
                let imgCountryContainer = document.querySelector(
                  ".img-country-container"
                );
                imgCountryContainer.innerHTML = `<img crossorigin="anonymous" class="img-country-item" src=${data.url}>`;
              }
            );
          }
        });
      }
    });
  });
