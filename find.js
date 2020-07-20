const API_KEY = "d2048335631e00bf4a6c7f60c550c793c15a04bf";

/**
 * @param {String} message
 */
function showFlash(message) {
    const flash = getFlashElement();
    flash.innerText = message;
}

function clearFlash() {
    const flash = getFlashElement();
    flash.innerText = "";
}

function getFlashElement() {
    return document.getElementById("flash-container");
}

function getOwnerInput() {
    let owner = document.getElementById("owner");
    if (owner.value.length === 0) throw new Error("Owner field should be filled");

    return owner.value;
}

function getRepoInput() {
    let repo = document.getElementById("repo");
    if (repo.value.length === 0) throw new Error("Repo field should be filled");

    return repo.value;
}

function getAssigneeInput() {
    let assignee = document.getElementById("assignee");
    return assignee.value;
}

function generateUrl(user, repo, assignee) {
    let beginPart = 'https://api.github.com/repos/' + user + '/'+ repo + '/issues';
    if (assignee.length === 0) return beginPart;

    return beginPart + '?assignee=' + assignee;
}

function clickOnFindButton() {
    clearFlash();
    let owner, repo, assignee;
    try {
        owner = getOwnerInput();
        repo = getRepoInput();
        assignee = getAssigneeInput();
    } catch (error) {
        showFlash(error.message)
        return;
    }
    let url = generateUrl(owner, repo, assignee);

    clearIssues();
    showRequestResult(url);
}

const showRequestResult = async (url) => {
    try {
        const result = await findRequest(url);
        if (result.length === 0) {
            showNotFound();
            return;
        }
        showIssues(result);
    } catch (err) {
        if (err.status === 404) {
            showNotFound();
            return;
        }
        showFindResponseError(err);
    }
};

const FindRequest = () => {
    let hiddenXHR;
    return url => {
        if (hiddenXHR) {
            hiddenXHR.abort();
            console.log("Previous request is aborted.")
        }
        return new Promise((resolve, reject) => {
            let progressPanel = document.getElementById("progress");
            progressPanel.style.display = "block";

            let xhr = new XMLHttpRequest();
            hiddenXHR = xhr;
            xhr.open('GET', url);
            xhr.setRequestHeader("Authorization", "token " + API_KEY);
            xhr.onload = function () {
                if (xhr.status !== 200) {
                    reject({
                        status: xhr.status,
                        response: JSON.parse(xhr.response)
                    });
                } else {
                    resolve(JSON.parse(xhr.response));
                }
                progressPanel.style.display = 'none';
            }

            xhr.send();
        });
    };
};

const findRequest = FindRequest();
