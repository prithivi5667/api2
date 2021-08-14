const your_license_key = "LXBYMB1I78I42EKHKLU6OTUNGXJJVGZE";
const Access_Key = "b6f0f8380c5d083cf0dad12f3fef1bd1";

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

searchCard = document.querySelector(".searchCard");
resultCard = document.querySelector(".resultCard");

function webChecker() {
    event.preventDefault();
    websiteName = document.getElementById("websiteName").value;

    if (websiteName !== "") {
        searchCard.style.display = "none";
        resultCard.style.display = "flex";
        httpCon = document.getElementById("httpCon").value;
        createCard(websiteName, httpCon);
    } else {
        searchCard.style.display = "flex";
        alert("Enter a valid website");
    }
}

function createCard(domain_name, httpCon) {
    fetch(`https://cors-anywhere.herokuapp.com/https://api.ip2whois.com/v1?key=${your_license_key}&domain=${domain_name}`
    // , {
        // method: "GET",
        // mode: "no-cors",
        // headers: {
        //   "Access-Control-Allow-Origin": "*",
        //   "Content-Type": "application/json",
        // },
    // }
    ).then(function(resp) {
        return resp.json();
    }).then(function(data) {
        console.log(data);
        errorCode = data.error_code;
        errorMsg = data.error_message;
        if (errorCode != "") {
            resultCard.innerHTML = `
        <h3 class="p-4 m-0">Error: <span class=" font-weight-bold">${errorMsg}</span></h3>
        `;
        } else {
            let siteName = data.domain;
            let createDate = data.create_date.split("-");
            let createYear = createDate[0];
            let expireDate = data.expire_date === "" ? ["∞"] : data.expire_date.split("-");
            let expireYear = expireDate[0];
            let registrarDomain = data.registrar.url;
            let registrarName = data.registrar.name;
            let days = data.domain_age;

            let padLock = "fa-lock"
              , padColor = "text-secondary"
              , padTitle = "N/A";

            if (httpCon == 1) {
                (padLock = "fa-unlock"),
                (padColor = "text-danger"),
                (padTitle = "Not Secured");
            }
            if (httpCon == 2) {
                padLock = "fa-lock";
                padColor = "text-success";
                padTitle = "Secured";
            }
            let isInfini = expireYear == "∞" ? "infi-text" : "";

            let cardData = `
        <div class="dynamicCard">
        <img
        class="card-img-top"
        src="http://api.screenshotlayer.com/api/capture?access_key=${Access_Key}&url=http://${siteName}&width=450"
        alt="Website image"
        />
        <div class="card-body text-center p-2">
        <i
        class="fas ${padLock} ${padColor}"
        data-toggle="tooltip"
          data-placement="left"
          title="${padTitle}"
          ></i>
          <a href="http://${siteName}" class="text-uppercase">${siteName}</a>
          </div>
          <div class="card-footer">
          <div class="row">
          <div class="col-6">
          <p class="mb-0">
          Registrar:
          <a class="font-weight-bold" href="${registrarDomain}">${registrarName}</a>
          </p>
          </div>
          <div class="col-6 text-right">
          ${calculateAge(days)}
          </div>
          </div>
          <div class="row mt-3">
          <div class="col-6 text-left">
          Created on:
          <span class="text-success font-weight-bold isMid ">${createYear}</span>
          </div>
          <div class="col-6 text-right">
          Expires on:
          <span class="text-danger font-weight-bold ml-2 ${isInfini}">${expireYear}</span>
          </div>
          </div>
          </div>
          </div>
          `;

            resultCard.innerHTML = cardData;
        }
    }).catch(function(err) {
        console.log("API Error:", err);
    });
}

const calculateAge = (d)=>{
    let months = 0
      , years = 0
      , days = 0;
    while (d) {
        if (d >= 365) {
            years++;
            d -= 365;
        } else if (d >= 30) {
            months++;
            d -= 30;
        } else {
            days++;
            d--;
        }
    }

    let totalDay = ""
      , totalMonth = ""
      , totalYear = ""
      , totalDate = "";

    if (days != 0) {
        totalDay = days === 1 ? `<span class="font-weight-bold">${days}</span> day ` : `<span class="font-weight-bold">${days}</span> days `;
    }
    if (months != 0) {
        totalMonth = months === 1 ? `<span class="font-weight-bold">${months}</span> month ` : `<span class="font-weight-bold">${months}</span> months `;
    }
    if (years != 0) {
        totalYear = years === 1 ? `<span class="font-weight-bold">${years}</span> year ` : `<span class="font-weight-bold">${years}</span> years `;
    }

    totalDate = totalDay + totalMonth + totalYear + "old";

    return totalDate;
}
;
