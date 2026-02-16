'use strict'

// Get alist of items in inventory based on the classification_id
const classificationList = document.getElementById("classificationList")

if (classificationList) {
    classificationList.addEventListener("change", () => {

        let classification_id = classificationList.value
        console.log(`classification_id is: ${classification_id}`)
        let classIdURL = `/inv/getInventory/${classification_id}`
        fetch(classIdURL)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK")
        })
        .then((data) => {
            console.log(data)
            buildInventoryList(data)
        })
        .catch((error) => {
            console.log("There was a problem: ", error.message)
        })
    })
}

function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay")
    let dataTable = "<thead>"
    dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>"
    dataTable += "</thead>"
    dataTable += "<tbody>"
    data.forEach(element => {
        console.log(element.inv_id + ", " + element.inv_model)
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`
        dataTable += `<td><a href="/inv/update/${element.inv_id}" title="Click to update">Modify</a></td>`
        dataTable += `<td><a href="/inv/delete/${element.inv_id}" title="Click to delete">Delete</a></td></tr>`

    })
    dataTable += "</tbody>"
    inventoryDisplay.innerHTML = dataTable
}

const form = document.getElementById("updateForm")
const updateBtn = document.querySelector("button")

updateBtn.disabled = true;

form.addEventListener("change", () => {
    updateBtn.disabled = false
})