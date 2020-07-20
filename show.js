/**
 *
 * @return {HTMLElement}
 */
function getIssuesElement() {
    return document.getElementById("issues-container");
}

function showNotFound() {
    const container = getIssuesElement();
    container.innerText = "По вашему запросу ничего не найдено.";
}

function clearIssues() {
    const container = getIssuesElement();
    container.innerText = "";
}

function showFindResponseError(err) {
    const container = getIssuesElement();
    container.innerHTML =
        "<p>Something wrong: </p>" +
        "<p>HTTP Status Code: " + err.status + "</p>" +
        "<p>Message: " + err.message  + "</p>";
}

function defineShortBody(body) {
    if (body === undefined || body === null) return "";

    if (body.length > 100) return body.substring(0, 99) + '...';

    return body;
}

/**
 * Выводится следующая информация:
 * номер issue, дата создания, заголовок, краткое описание.
 *
 * @param issues
 */
function showIssues(issues) {
    const table = document.createElement('table');

    for (let issue of issues) {
        const tdNumber = document.createElement('td');
        tdNumber.innerText = issue.number;

        const tdDate = document.createElement('td');
        tdDate.innerText = issue.created_at;

        const tdSummary = document.createElement('td');
        tdSummary.innerText = issue.title;

        const tdDescription = document.createElement('td');
        tdDescription.innerText = defineShortBody(issue.body);

        const tr = document.createElement('tr');
        tr.append(tdNumber);
        tr.append(tdDate);
        tr.append(tdSummary);
        tr.append(tdDescription);
        table.append(tr);
    }
    const container = getIssuesElement();
    container.append(table);
}
