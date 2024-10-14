
const sendData = async (data, route) => {
    request = await fetch(`http://127.0.0.1:5000/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const response = await request.json();

    console.log(response);
    
}

const receiveData = async (route) => {
    response = await fetch(`http://127.0.0.1:5000/${route}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();

    return data;
}