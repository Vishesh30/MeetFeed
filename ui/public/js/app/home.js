const login = async e => {
    e.preventDefault();

    const eventName = document.getElementById('eventName').value;
    let eventData = {};
    eventData.eventName = eventName;

    const option = {
        headers:{
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            eventName
        }),
        redirect: "follow"
    } 

    const response  = await fetch('/api/event',option);
    const dataz = await response.json();

    window.location.href = '/ui/event/' + dataz._id + "/showposts"
}